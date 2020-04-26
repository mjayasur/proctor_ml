import React from 'react';
import './Dashboard.css'
import gradient from './gradient.jpeg'
import plus from './plusbutton.png'
import ExamBox from './ExamBox.js'
import Axios from 'axios';
import gradient2 from './gradient2.jpg'
import './Home.css'
import io from 'socket.io-client';
import firebase from 'firebase'
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true,
        passwordValidated : false,
        exams : []
    }
    this.password = React.createRef();
    this.exam_name = React.createRef();
    this.time_limit = React.createRef();
    this.date = React.createRef();
  }
  createStuff = () => {
    console.log("createstuff")
  }

  fetchingExams = () => {
      console.log("https://proctor.ml:4001/get-exams/"+localStorage.getItem("email"))
    fetch("https://proctor.ml:4001/get-exams/"+localStorage.getItem("email"))
      .then(response => response.json())
      .then(
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (result) => {
          let examBoxes = []
          var arrayLength = result.length
          for(var i = 0; i < arrayLength; i++){
            examBoxes.push(
              <ExamBox name={result[i].exam_name} date={result[i].date} exam_id = {result[i].exam_id} />
            )
          }

          this.setState({
            loading: false,
            exams : examBoxes
            
          });

        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  fetching = () => {
    fetch("https://proctor.ml:4001/check-password/"+this.password.current.value)
      .then(response => response.json())
      .then(
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        // exam_info = (req.body.exam_info)
        // instructor = (req.body.instructorid)
        (result) => {
          this.setState({passwordValidated:result})
          console.log(this.state.passwordValidated)
          if(!this.state.passwordValidated){
            alert("Invalid password")
          }else if(isNaN(parseInt(this.time_limit.current.value))){
            alert("Invalid time limit")
          }else if(this.exam_name.current.value == ""){
            alert("Invalid exam name")
          } else{
            Axios.post('https://proctor.ml:4001/create-exam',{
              exam_info : {exam_name: this.exam_name.current.value,
              time_limit: parseInt(this.time_limit.current.value)*1000*60,
              date: this.date.current.value},
              instructorid : localStorage.getItem("email")
            })
            .then(function (response) {
              console.log(response);
              
            })
            .catch(function (error) {
              console.log(error);
            })
          }
          

        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      ).then((result)=>{setTimeout(this.fetchingExams, 1000)})
  }

  render() {

    return (
      <div >
                  <nav class="navbar navbar-b navbar-trans navbar-expand-md fixed-top text-center" id="mainNav">
            <div class="container">
            <a class="navbar-brand js-scroll mx-auto" style={{color : "black"}} href="#page-top">Proctor.ml</a>
            <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarDefault" aria-controls="navbarDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="navbar-collapse collapse justify-content-end" id="navbarDefault">
                <ul class="navbar-nav">


                </ul>
            </div>
            </div>
        </nav>
          
      <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalCenterTitle">New Exam</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form className="needs-validation" novalidate>
              <div className="form-group">
                <label for="password">Password</label>
                <input type="password" className="form-control" ref={this.password} id="password" placeholder="Password"/>
              </div>
              <div className="form-group">
                <label for="exam_name">Exam Name</label>
                <input type="text" className="form-control" ref={this.exam_name} id="exam_name" placeholder="Midterm 2"/>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label for="date">Date</label>
                  <input type="date" className="form-control" ref={this.date} id="date" placeholder="mm-dd-yyyy" required/>
                </div>
                <div className="form-group col-md-6">
                  <label for="time_limit">Time Limit (minutes)</label>
                  <input type="text" className="form-control" ref={this.time_limit} id="time_limit" required/>
                  <div className="invalid-feedback">
                    Please provide a valid time limit.
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary" data-dismiss="modal" id='btnSubmit' onClick={this.fetching}>Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
      <div className="container text-center mt-5">

        <div class="row">
          <div class="col-sm-12">
            <div class="title-box text-center">
              <h3 class="title-a">
                Exams
              </h3>
              <p class="subtitle-a" id='name'>
                {localStorage.getItem("username")}
              </p>
              <div class="line-mf"></div>
            </div>
          </div>
        </div>

        <div>
          <div className="row mt-1">
            <div className="work-box col-md-4">
                <div className="work-img">
                  <img src={gradient2} alt="" className="img-fluid mt-3" height='200' width='300' />
                </div>
                <div className="work-content">
                  <div className="row">
                    <div className="col-sm-8">
                      <h2 className="w-title">Create New Exam</h2>
                      <div className="w-more">
                        <span className="w-ctegory">TBD</span> / <span class="w-date">TBA 2020</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="w-like mb-3">
                        <img onClick={this.createStuff} data-toggle="modal" data-target="#exampleModalCenter" height={40} width={40} src = {plus} ></img>
                      </div>
                    </div>
                  </div>
                </div>
                
            </div>
            {this.state.exams}
            
          </div>
        </div>
        
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (localStorage.getItem("username") === null) {
        window.location.assign("/")
    }
    this.fetchingExams()

  }
}

export default Dashboard;
