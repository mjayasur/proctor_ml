'use strict';
const e = React.createElement;

class Clarification extends React.Component {
    constructor() {
        super()
        this.state = {
            loading : true,
            clarifications : []

        }
        this.exam_id = this.findGetParameter('exam_id')

    }
    findGetParameter = (parameterName) => {
        var result = null,
          tmp = [];
        location.search
          .substr(1)
          .split("&")
          .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
          });
        return result;
    }
    render() {
        if (this.state.loading)
            return (<div>loading</div>);
        return (
            <div className = "container">
                <ul className = 'list-group'>
                    {this.state.clarifications}
                </ul>
            </div>
        )
    }
    fetching = () => {

        fetch("https://proctor.ml:4001/get-clarifications/" + this.exam_id)
        .then(res=>res.json())
        .then(
            result => {
                var my_list = []
                
                for (var i = 0; i < result.length; i++) {
                    my_list.push(<li key={i} className = "list-group-item">{result[i].clarification} </li>)
                }
                this.setState({clarifications : my_list, loading : false})

            }
        )
    }
    componentDidMount() {
        this.fetching()
        const socket = io('https://proctor.ml:4001/')
        socket.on("new clarification", (id) => {

            if (id == this.exam_id) {
                this.fetching()
            }
        })
    }
}

const domContainer = document.querySelector('#clarifications_div');
ReactDOM.render(e(Clarification), domContainer);