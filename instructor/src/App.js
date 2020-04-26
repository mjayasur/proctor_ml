import React from 'react';
import Exam from './Exam';
import Dashboard from './Dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/exam/:id" component={Exam}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </div>


      </Router>
    )
  }
  
}

export default App;
