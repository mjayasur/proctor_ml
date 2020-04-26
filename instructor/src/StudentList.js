import React from 'react';
import io from 'socket.io-client';
class StudentList extends React.Component {
  constructor() {
    super();
    this.state = {
        students : [],
        loading : true
  
      };
  }

  render() {
    if (this.state.loading) {
        return (
          <div>
            Loading
          </div>
        );
      } else {
        return (
            <div className="container mt-5">
                
                <table className="mt-3 table table-hover">
                    <thead>
                    <tr className="table-active">
                        <th scope="col">Student ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.students}
                    </tbody>
                </table>
            </div>
        )
      }
  }

  componentDidMount() {
    this.fetching()
    var socket = io('https://proctor.ml:4001/')
    socket.on('send status update',this.fetching)
  }

  fetching = () => {
      console.log('hi')
    fetch("https://proctor.ml:4001/get-students/"+this.props.exam_id)
      .then(res => res.json())
      .then(
        (result) => {
            console.log(result)
          let studentsList = []
          var arrayLength = result.exam_students.length
          for (var i = 0; i < arrayLength; i++) {
            var status = result.exam_students[i].status
            var status_color = "table-active"
            if(status === 'connected'){
              status_color = "table-success"
            } else if(status === 'not_in_frame'){
              status_color = 'table-warning'
            } else if(status === 'bathroom_break'){
              status_color = 'table-info'
            } else if(status === 'two_in_frame'){
                status_color = 'table-danger'
            }
            studentsList.push(
              <tr className={status_color}>
                <td>{result.exam_students[i].sid}</td>
                <td>{result.exam_students[i].name}</td>
                <td>{result.exam_students[i].status}</td>
              </tr>
            )
          }
          console.log(studentsList)

          this.setState({
            loading: false,
            students : studentsList
            
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

export default StudentList;
