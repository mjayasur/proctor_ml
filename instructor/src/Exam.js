import React from 'react';
import StudentList from './StudentList';
import Timer from './Timer'
import logo from './randomcheck.png'
import io from 'socket.io-client';
import {useParams} from "react-router-dom";
import Clarifications from './Clarifications';
class Exam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          exam_info : null,
          loading : true,
          changes : 0,
          start_time : null,
          studenturl : ""
        }
        this.exam_id = props.match.params.id;
        console.log(this.exam_id)
      }
    
      start_exam = () => {
        const socket = io("https://proctor.ml:4001/")
    
    
        socket.emit('start exam', new Date().getTime(), this.exam_id)
        socket.on('started', this.fetching_fetching)
        
      }
      fetching_fetching = (exam_id) => {
        if (exam_id == this.exam_id) {
          this.fetching()
        }
      }
    
      render() {
        if (this.state.loading) {
          return <div>loading</div>
        }
        if (this.state.exam_info.started === 0) {
          let distance = this.state.exam_info.time_limit
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          var timestr = hours + "h " + minutes + "m " + seconds + "s "
          return (
            <div className="text-center mt-5">
            <img height={100} width={100} src={logo}></img>
            <p className = "h3">{timestr}</p>
            <button onClick={this.start_exam} className = "btn btn-primary">Start Exam</button>
            <p className = "h3">
                Tell your students to use this url to login: {this.state.studenturl}
            </p>
            <Clarifications exam_id = {this.exam_id} />
            <StudentList exam_id = {this.exam_id}/>
    
    
          </div>
          )
        }
        
        return (
    
          <div className="text-center mt-5">
            <img height={100} width={100} src={logo}></img>
            <Timer countDownDate = {this.state.exam_info.start_time +this.state.exam_info.time_limit } ></Timer>
            <p className = "h3">
                Tell your students to use this url to login: {this.state.studenturl}
            </p>
            <Clarifications exam_id = {this.exam_id} />
            
            <StudentList exam_id = {this.exam_id}/>
    
    
          </div>
        )
      }
    
      componentDidMount() {
        this.fetching()
        
        this.setState({
            studenturl : "https://proctor.ml/login.html?exam_id=" +this.exam_id
        })

        console.log(this.exam_id)
      }
      fetching = () => {
        fetch("https://proctor.ml:4001/get-exam-info/"+this.exam_id)
          .then(res => res.json())
          .then(
            (result) => {
                console.log(result)
              
    
              this.setState({
                loading: false,
                exam_info : result,
                changes : this.state.changes + 1
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }
}

export default Exam;
