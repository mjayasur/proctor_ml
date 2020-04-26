import React from 'react';
import cv;
class VideoChat extends React.Component {
  constructor(props) {
    super(props)

    
    this.state = {
      cameras : [],
      src : null,
      peerVideos : []
    }
  
  }

  updateCameraList = (cam_list) => {
    
    
    let i = 0;
    let new_list = []
    
    cam_list.forEach(element => new_list.push({
      label : element.label,
      id : element.id
    }));

    this.setState({
      cameras : new_list
    });
    
    
    
  }

  // Fetch an array of devices of a certain type
  getConnectedDevices = async (type) => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices)
      return devices.filter(device => device.kind === type)
  }

  playVideoFromCamera = async () => {
    try {
        const constraints = {'video': true, 'audio': true};
        
        console.log(navigator.mediaDevices)
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.setState({
          src : stream
        })
        this.video.srcObject = stream;
        console.log(stream)
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}

  componentDidMount() {

    let constraints = {
      'video': true,
      'audio': true
    }
    console.log(navigator)

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream);
      })
      .catch(error => {
          console.error('Error accessing media devices.', error);
      });
          // Get the initial set of cameras connected
    const videoCameras = this.getConnectedDevices('videoinput');
    
    videoCameras.then(value => {
      this.updateCameraList(value)
    });

    // Listen for changes to media devices and update the list accordingly
    navigator.mediaDevices.addEventListener('devicechange', event => {
        const newCameraList = this.getConnectedDevices('videoinput');
        this.updateCameraList(newCameraList);
    });
    let streaming = true;
    this.playVideoFromCamera();
    let video = this.video;
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();

    // load pre-trained classifiers
    classifier.load('haarcascade_frontalface_default.xml');

    const FPS = 30;
    function processVideo() {
        try {
            if (!streaming) {
                // clean and stop.
                src.delete();
                dst.delete();
                gray.delete();
                faces.delete();
                classifier.delete();
                return;
            }
            let begin = Date.now();
            // start processing.
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            // detect faces.
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
            // draw faces.
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            }
            cv.imshow('canvasOutput', dst);
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            utils.printError(err);
        }
    };

    // schedule the first one.
    setTimeout(processVideo, 0);




  }

  


  render() {
    if (this.state.cameras.length == 0) {
      return null;
    }
    return (
      <div className="VideoChat">
        <div className = "row">
          <div className = "mt-3 col">



            <video className = "myvideo" muted ref={video => {this.video = video}} autoPlay   />

          </div>
          <div className = "mt-3 col">
            <canvas id="canvasOutput" ></canvas>
          </div>

        </div>
      </div>
    );
  }
}

export default VideoChat;
