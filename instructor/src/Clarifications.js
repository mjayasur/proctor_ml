import React from 'react';
import Axios from 'axios';
import io from 'socket.io-client'
class Clarifications extends React.Component {
  constructor() {
    super();
    this.state = {
        clarifications : [],
        loading : false
    }
    this.clarificationRef = React.createRef();
  }

  sendClarification = () => {
    console.log(this.clarificationRef.current.value)
    if (this.clarificationRef.current.value.length == 0) {
        alert("Please write something!")
        return;
    }
    Axios.post('https://proctor.ml:4001/create-clarification',{
        exam_id: this.props.exam_id,

        clarification : this.clarificationRef.current.value
    })
    .then(function (response) {
        console.log(response);

    })
    .catch(function (error) {
        console.log(error);
    })
    .then((response) => {
        this.get_clarifications()
        const socket = io('https://proctor.ml:4001')
        socket.emit('clarification', this.props.exam_id)
    })
  }

  render() {
    if (this.state.loading) {
        return <div>Loading...</div>
    } else {
        return (<div className = "container text-left mt-5">

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">New message</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>

                    <div class="form-group">
                        <label for="message-text" class="col-form-label">Clarification:</label>
                        <textarea ref={this.clarificationRef} class="form-control" id="message-text"></textarea>
                    </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button onClick = {this.sendClarification} data-dismiss="modal" type="button" class="btn btn-primary">Create Clarification</button>
                </div>
                </div>
            </div>
            </div>
            <p className = "h3">Clarifications:</p>            
            <ul className = "list-group">

                {this.state.clarifications}
            </ul>
            <button type="button" class="mt-3 btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Create New Clarification!</button>

        </div>)
    }

  }
//   delete_clarification = (e) => {

//     Axios.post('https://proctor.ml:4001/delete-clarification',{
//         exam_id: this.props.exam_id,
        
//         clarification : e.target.value
//       })
//       .then(function (response) {
//         console.log(response);
        
//       })
//       .catch(function (error) {
//         console.log(error);
//       })
//       .then((response) => {
//           this.get_clarifications()
//       })
//   }

  get_clarifications = () => {
      fetch("https://proctor.ml:4001/get-clarifications/"+this.props.exam_id)
      .then(res=>res.json())
      .then(
          (result) => {
              var newClarifications = []
              for (var i = 0; i < result.length; i++) {
                  newClarifications.push(
                    <li className="list-group-item" key={i}>
                        {result[i].clarification}
                        {/* <button type="button" value={result[i].clarification} onClick = {this.delete_clarification} class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button> */}
                    </li>)
              }
              this.setState({clarifications : newClarifications, loading : false})
              
          }
      )
  }

  componentDidMount() {
    this.get_clarifications();
  }
}

export default Clarifications;
