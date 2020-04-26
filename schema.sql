CREATE TABLE IF NOT EXISTS exams (
	instructor_id TEXT,
	password TEXT,
    exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_name TEXT NOT NULL,
	time_limit INTEGER NOT NULL,
    start_time INTEGER,
    date TEXT NOT NULL,
    started INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS students (
    sid INTEGER NOT NULL,
    email TEXT,
    name TEXT,
    exam_id INTEGER,
    status TEXT,
    UNIQUE(sid, exam_id)
);
CREATE TABLE IF NOT EXISTS passwords (
    password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS clarifications (
    exam_id INTEGER NOT NULL,
    clarification TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS questions (
    exam_id INTEGER NOT NULL,
    question TEXT NOT NULL
);