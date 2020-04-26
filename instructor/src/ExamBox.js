import React from 'react';
import gradient from './gradient.jpeg'
import gradient2 from './gradient2.jpg'
import gradient3 from './gradient3.jpeg'
import gradient4 from './gradient4.jpeg'
import gradient5 from './gradient5.jpeg'
import gradient6 from './gradient6.jpeg'
import gradient7 from './gradient7.jpeg'
import gradient8 from './gradient8.jpeg'
import gradient9 from './gradient9.jpg'
import plus from './plusbutton.png'

class ExamBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      someKey: 'someValue'
    };
    var gradients = [gradient, gradient2, gradient3, gradient4, gradient5, gradient7, gradient6, gradient8, gradient4]
    this.src = gradients[Math.floor(Math.random() * 10)]
  }

  render() {
    return (
      
      <div className="work-box col-md-4">
      <div className="work-img">
        <img src={this.src} alt={gradient4} className="img-fluid mt-3" height='200' width='300'/>
      </div>
      <div className="work-content">
      <a href={"/exam/"+this.props.exam_id}>
        <div className="row">
          <div className="col-sm-8">
            <h2 className="w-title">{this.props.name}</h2>
            <div className="w-more">
              <span className="w-ctegory">{this.props.date}</span>
            </div>
          </div>
          <div className="col-sm-4">

          </div>
        </div>
        </a>
      </div>
      
      </div>
      
    );
  }

  componentDidMount() {
    this.setState({
      someKey: 'otherValue'
    });
  }
}

export default ExamBox;
