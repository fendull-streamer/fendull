import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TwitchAuth from './TwitchAuth'
import * as serviceWorker from './serviceWorker';
console.log(process.env.REACT_APP_REDIRECT_URI)
ReactDOM.render(
  <React.StrictMode>
    <TwitchAuth clientId="9zgymms0nexuuqai86o1gkdz31sgp4" redirectUri={process.env.REACT_APP_REDIRECT_URI}>
      <App />
    </TwitchAuth>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
