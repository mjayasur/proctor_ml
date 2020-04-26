import React from 'react';

import './App.css';
import VideoChat from './VideoChat';

class App extends React.Component {
  constructor(props) {
    super(props);

       
  }





  render() {
    return (
      <div>
        <VideoChat />
        <canvas id="canvasOutput"></canvas>
      </div>
    );
  }

}

export default App;
