'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var Timer = function (_React$Component) {
  _inherits(Timer, _React$Component);

  function Timer() {
    _classCallCheck(this, Timer);

    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this));

    _this.findGetParameter = function (parameterName) {
      var result = null,
          tmp = [];
      location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
      return result;
    };

    _this.dothis = function (x) {

      var cdd = _this.state.countDownDate;
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = cdd - now;

      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
      var seconds = Math.floor(distance % (1000 * 60) / 1000);

      // Output the result in an element with id="demo"
      _this.setState({ time_remaining: hours + "h " + minutes + "m " + seconds + "s " });

      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        _this.setState({ time_remaining: "Test Ended" });
      }
    };

    _this.fetching = function () {

      fetch("https://proctor.ml:4001/get-exam-info/" + _this.exam_id).then(function (res) {
        return res.json();
      }).then(function (result) {
        var distance = result.time_limit;
        var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(distance % (1000 * 60) / 1000);
        var timestr = hours + "h " + minutes + "m " + seconds + "s ";
        _this.setState({
          countDownDate: result.start_time + result.time_limit,
          time_remaining: timestr,
          loading: false
        });
        console.log(result);
        if (result.started) {
          var x = setInterval(_this.dothis, 1000);
        }
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      function (error) {
        _this.setState({
          isLoaded: true,
          error: error
        });
      });
    };

    _this.state = {
      time_remaining: null,
      countDownDate: null,
      loading: true
    };
    _this.exam_id = _this.findGetParameter('exam_id');
    return _this;
  }

  _createClass(Timer, [{
    key: 'render',
    value: function render() {
      if (this.state.loading) {
        return React.createElement(
          'div',
          null,
          'loading'
        );
      }
      return React.createElement(
        'div',
        { className: 'mt-3' },
        React.createElement(
          'p',
          { className: 'h3' },
          this.state.time_remaining
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // Update the count down every 1 second

      this.fetching();
      var socket = io('https://proctor.ml:4001/');
      socket.on('started', function (id) {
        _this2.fetching();
      });
    }
  }]);

  return Timer;
}(React.Component);

var domContainer = document.querySelector('#timer_div');
ReactDOM.render(e(Timer), domContainer);