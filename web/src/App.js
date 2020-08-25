import React from 'react';
import Controller from './Controller';

import './App.css';

function App(props) {
  return (
    <React.Fragment>
      
      <Controller authData={props.authData}/>
    </React.Fragment>
  );
}

export default App;
