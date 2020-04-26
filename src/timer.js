'use strict';
const e = React.createElement;

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      time_remaining : null,
      countDownDate : null,
      loading : true
    };
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
    if (this.state.loading) {
      return (
        <div>
          loading
        </div>
      )
    }
    return (
        <div className="mt-3">
            <p className = "h3">{this.state.time_remaining}</p>
        </div>
    );
  }
  dothis = (x) => {
    
    const cdd = this.state.countDownDate
    // Get today's date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance = cdd - now;

    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="demo"
    this.setState({ time_remaining : hours + "h "
    + minutes + "m " + seconds + "s "})
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(x);
      this.setState({ time_remaining : "Test Ended"});
    }
  }
  fetching = () => {

  fetch("https://proctor.ml:4001/get-exam-info/"+this.exam_id)
    .then(res => res.json())
    .then(
      (result) => {
        let distance = result.time_limit
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var timestr = hours + "h " + minutes + "m " + seconds + "s "
        this.setState({
          countDownDate : result.start_time + result.time_limit,
          time_remaining : timestr,
          loading : false
        })
        console.log(result)
        if (result.started) {
          var x = setInterval(this.dothis, 1000);
        }
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
  componentDidMount() {
      // Update the count down every 1 second
        
        this.fetching()
        const socket = io('https://proctor.ml:4001/')
        socket.on('started', (id) => {
          this.fetching()
        })

        

  }
}

const domContainer = document.querySelector('#timer_div');
ReactDOM.render(e(Timer), domContainer);