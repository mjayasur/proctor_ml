import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time_remaining : props.duration,
      countDownDate : props.countDownDate
    };
    console.log(props)
  }

  render() {
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
  componentDidMount() {
      // Update the count down every 1 second
        

        var x = setInterval(this.dothis, 1000);
  }
}

export default Timer;
