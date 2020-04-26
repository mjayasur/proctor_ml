'use strict';

const e = React.createElement;

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { students: [] };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    // Display a "Like" <button>
    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    );
  }
}

const domContainer = document.querySelector('#studentList');
ReactDOM.render(e(LikeButton), domContainer);