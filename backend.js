var express = require('express')

var fs = require('fs')
const options = {
	cert : fs.readFileSync("/etc/letsencrypt/live/proctor.ml/fullchain.pem"),
	key : fs.readFileSync("/etc/letsencrypt/live/proctor.ml/privkey.pem")
};
var app = express();
const sqlite3 = require('sqlite3').verbose();
var http = require('http').createServer(app);
var https = require('https')
const server = https.createServer(options, app)
const io = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
var cors = require('cors')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())
io.on('connection', (socket) => {
    console.log('a user connected');
    var startTime = null;
    var started = false;

    socket.on('exam-added', ()=> {
        io.emit('exam-added')
    })
    socket.on('connect student', (sid, name, exam_id, email) => {
        io.emit('student connected', sid, name, exam_id)
        console.log("student connected with sid " + sid)
        let db = new sqlite3.Database('./proctor.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the proctor.db database.');
            }
        );
        db.serialize(() => {
            db.run("INSERT OR IGNORE INTO students (sid, email, name, exam_id, status) VALUES (?, ?, ?, ?, ?)",
                parseInt(sid), (email), (name), (exam_id), "connected"
            )
          });
          
        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        })
    });
    
    socket.on('start exam', (time, exam_id) => {
        startTime = time;
        started = true;
        let db = new sqlite3.Database('./proctor.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the proctor.db database.');
            }
        );
        db.serialize(() => {
            db.run("UPDATE exams SET started = ?, start_time = ? WHERE exam_id = ?",
                1, time, exam_id
            )
          });
          
        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        })
        io.emit('started', exam_id);
    })
    socket.on('status update', (sid, new_status, exam_id) => {
        console.log("status update:" + new_status)
        console.log("sid:" + sid)
        console.log("exam_id:" + exam_id)
        io.emit('send status update')
        let db = new sqlite3.Database('./proctor.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the proctor.db database.');
            }
        );
        db.serialize(() => {
            db.run("UPDATE students SET status = ? WHERE sid = ? AND exam_id = ?",
                new_status, sid, exam_id
            )
          });
          
        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        })

    })
    
    socket.on('clarification', (exam_id) => {
        io.emit("new clarification", exam_id)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
    
// get method route
app.get('/get-exams/:instructoremail', function (req, res) {
    instructor = req.params.instructoremail;
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );
    var exams = []
    gotRow = (err, row) => {
        exams.push(row)
        console.log(row)
      }
  
    db.serialize(() => {
        db.each('SELECT * FROM exams WHERE instructor_id = ?', instructor, gotRow);
    })    
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    res.send(exams)
    });
    
})
app.get('/check-password/:password', function(req, res) {
    let password = req.params.password;
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );
    var count = 0
    db.serialize(() => {
        db.each('SELECT * FROM passwords WHERE password = ?', password, (err, password) => {
            console.log('hi')
            count++;
        });
    })
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        res.send(count > 0)
    })
    
    
    
})
app.get('/get-students/:examid', function (req, res) {
    let examid = req.params.examid;
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );
    students = []

    db.serialize(() => {
        db.each('SELECT * FROM students WHERE exam_id = ?', examid, (err, student) => {
            console.log(student)
            students.push(student)
        });
    })    
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    res.send({exam_students : students})
    });
    
})
app.get('/get-exam-info/:exam_id', function(req, res) {
    let examid = req.params.exam_id;
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );

    let exam = {}

    db.serialize(() => {
        db.each('SELECT * FROM exams WHERE exam_id = ?', parseInt(examid), (err, exam_obj) => {
            console.log(exam)
            exam = exam_obj
        });
    })    
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    res.send(exam)
    });
})

app.post('/create-exam', function (req, res) {
    /*
        {
            "id" : instructor id,
            "password" : instructor password,
            "exam_name" : name of the exam
            "time_limit" : time limit for exam
            "date" : date of the exam
            "semester" : semester of the exam
        }
        	instructor_id INTEGER,
	password TEXT,
    exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_name TEXT NOT NULL,
	time_limit TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    semester TEXT NOT NULL
     */
    exam_info = (req.body.exam_info)
    instructor = (req.body.instructorid)
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );

    db.serialize(() => {
        db.run("INSERT INTO exams (instructor_id, exam_name, time_limit, date) VALUES (?, ?, ?, ?)",
            (instructor),(exam_info.exam_name), (parseInt(exam_info.time_limit)), (exam_info.date)
        )
        
      });
      
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    });
    res.send("Done!")

    
})
app.get('/get-clarifications/:exam_id', function (req, res) {
    var exam_id = req.params.exam_id;
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );
    var clarificationsList = []
    db.serialize(() => {
        
        db.each('SELECT clarification FROM clarifications WHERE exam_id = ?', parseInt(exam_id), (err, clarification) => {
            console.log(clarification)
            clarificationsList.push(clarification)        
        });
    });
      
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        res.send(clarificationsList)
    })
})
app.post('/create-clarification', function (req, res) {
    /*
        {
            "id" : instructor id,
            "password" : instructor password,
            "exam_name" : name of the exam
            "time_limit" : time limit for exam
            "date" : date of the exam
            "semester" : semester of the exam
        }
        	instructor_id INTEGER,
	password TEXT,
    exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_name TEXT NOT NULL,
	time_limit TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    semester TEXT NOT NULL
     */
    
    var request = (req.body)
    var exam_id = request.exam_id
    var clarification = request.clarification
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );

    db.serialize(() => {
        db.run("INSERT INTO clarifications (exam_id, clarification) VALUES (?, ?)",
            exam_id, clarification
        )
      });
      
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    });
    res.send("Done!")
})
app.post('/delete-clarification', function (req, res) {
    /*
        {
            "id" : instructor id,
            "password" : instructor password,
            "exam_name" : name of the exam
            "time_limit" : time limit for exam
            "date" : date of the exam
            "semester" : semester of the exam
        }
        	instructor_id INTEGER,
	password TEXT,
    exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_name TEXT NOT NULL,
	time_limit TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    semester TEXT NOT NULL
     */
    
    var request = (req.body)
    var exam_id = request.exam_id
    var clarification = request.clarification
    let db = new sqlite3.Database('./proctor.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the proctor.db database.');
        }
    );

    db.serialize(() => {
        db.run("DELETE FROM clarifications WHERE exam_id = ? AND clarification = ?",
            exam_id, clarification
        )
      });
      
    db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
    });
    res.send("Done!")
})

//https.createServer({
//    key: fs.readFileSync('server.key'),
//    cert: fs.readFileSync('server.cert')
//  }, app)
//  .listen(3001, function () {
//    console.log('Example app listening on port 3001! Go to https://localhost:3001/')
//  })
server.listen(4001, () => {
	console.log("listening on *:4001")
});

 http.listen(3001, () => {
   console.log('listening on *:3001');
 });
