import React from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo'
import './App.css';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';



const apps = new Clarifai.App({
 apiKey: '753158e3e5d340b0ba92da916edb468f'
});

const particleOptions = {
  particles: {
    value: 100,
    density: {
      enable: true,
      value_area: 800
    }
  }
}

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }
  
  componentDidMount(){
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(console.log)
  }

  loadUser = (data) =>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0]
                          .region_info.bounding_box;

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height) 
    }
  }


  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    
    apps.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => {
        if(response){
          fetch('http://localhost:3001/image',{
            method: 'put',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
      
      

      
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      
      .catch(err => alert('Please select a valid photo file'));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn: false});

    }
    else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route : route});
  }

  render(){
    const {isSignedIn, box, imageUrl, route} = this.state;
    return (
      <div className="App">
        <Particles className = 'particles'
          params = {particleOptions}/>
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
        { route === 'home'  
        ?
        <div>
          <Logo />
          <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange = {this.onInputChange} 
            onButtonSubmit = {this.onButtonSubmit}/>
          <FaceRecognition box = {box} imageUrl = {imageUrl}/>
        </div>
        :(
          route === 'signin' 
          ?
          <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
          :
          <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
        )
        }
      </div>
    );
  }
}

export default App;
