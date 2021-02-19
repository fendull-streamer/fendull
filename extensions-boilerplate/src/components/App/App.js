import React from 'react';
import './App.css';
import Menu from './Menu';
import Authentication from '../../util/Authentication/Authentication';

function App() {
    const authentication = new Authentication()

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
    const twitch = window.Twitch ? window.Twitch.ext : null;
    if(twitch){
        twitch.onAuthorized((auth)=>{
            console.log(auth)
            authentication.setToken(auth.token, auth.userId)
        })
    }
  return (
    <div className="App">
      <Menu auth={authentication}/>
    </div>
  );
}

export default App;
