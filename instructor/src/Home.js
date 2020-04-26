import React from 'react';
import gradient2 from './gradient2.jpg'
import './Home.css'
import firebase from 'firebase'
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
        user : null
    }
  }

  render() {
    return (
        <div id="home" class="intro route bg-image" style={{ backgroundImage: `url(${gradient2})` }}>
        <nav class="navbar navbar-b navbar-trans navbar-expand-md fixed-top text-center" id="mainNav">
            <div class="container">
            <a class="navbar-brand js-scroll mx-auto" href="#page-top">Proctor.ml</a>
            <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarDefault" aria-controls="navbarDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="navbar-collapse collapse justify-content-end" id="navbarDefault">
                <ul class="navbar-nav">


                </ul>
            </div>
            </div>
        </nav>
        <div class="overlay-itro"></div>
        <div class="intro-content display-table">
          <div class="table-cell">
            <div class="container">
  
              <h1 class="intro-title mb-4">Proctor.ml</h1>
              <p class="intro-subtitle"><span class="text-slider-items">Take Exams,Ask Questions,Remote Learning,Education Revolutionized,</span><strong class="text-slider"></strong></p>
              <p>Simply sign in, create an exam, and you're ready to proctor.</p>
              <button class="btn btn-primary btn js-scroll px-4" onClick={this.signIn}>Sign In</button>
              <div class="row mt-5">
                  <div class = "col-4">
                      
                      <p>Using computer vision, we will make sure no cheating happens during your exam, reducing stress for both the student and instructor.</p>
                  </div>
                  <div class = "col-4">
                      <p>Easily manage your clarifications. Real time data transfer means no more messy Google Docs that crash on a few hundred listeners.</p>
                  </div>
                  <div class = "col-4">
                      <p>The most reliable timer you've ever used. Yeah, we know you're impressed.</p>
                  </div>
                  
    
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({user})
          localStorage.setItem("username", user.displayName);
          localStorage.setItem("email", user.email)

          window.location.assign('/dashboard')
        }
      })
  }
}

export default Home;
