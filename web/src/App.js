import React from 'react';
import Controller from './Controller';
import Header from './Header';
import './App.css';

function App(props) {
  return (
    <React.Fragment>
      <Header authData={props.authData}/>
      <Controller authData={props.authData}/>
    </React.Fragment>
  );
}

export default App;
