'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var Clarification = function (_React$Component) {
    _inherits(Clarification, _React$Component);

    function Clarification() {
        _classCallCheck(this, Clarification);

        var _this = _possibleConstructorReturn(this, (Clarification.__proto__ || Object.getPrototypeOf(Clarification)).call(this));

        _this.findGetParameter = function (parameterName) {
            var result = null,
                tmp = [];
            location.search.substr(1).split("&").forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
            return result;
        };

        _this.fetching = function () {

            fetch("https://proctor.ml:4001/get-clarifications/" + _this.exam_id).then(function (res) {
                return res.json();
            }).then(function (result) {
                var my_list = [];

                for (var i = 0; i < result.length; i++) {
                    my_list.push(React.createElement(
                        'li',
                        { key: i, className: 'list-group-item' },
                        result[i].clarification,
                        ' '
                    ));
                }
                _this.setState({ clarifications: my_list, loading: false });
            });
        };

        _this.state = {
            loading: true,
            clarifications: []

        };
        _this.exam_id = _this.findGetParameter('exam_id');

        return _this;
    }

    _createClass(Clarification, [{
        key: 'render',
        value: function render() {
            if (this.state.loading) return React.createElement(
                'div',
                null,
                'loading'
            );
            return React.createElement(
                'div',
                { className: 'container' },
                React.createElement(
                    'ul',
                    { className: 'list-group' },
                    this.state.clarifications
                )
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.fetching();
            var socket = io('https://proctor.ml:4001/');
            socket.on("new clarification", function (id) {

                if (id == _this2.exam_id) {
                    _this2.fetching();
                }
            });
        }
    }]);

    return Clarification;
}(React.Component);

var domContainer = document.querySelector('#clarifications_div');
ReactDOM.render(e(Clarification), domContainer);