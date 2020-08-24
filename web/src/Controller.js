import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Homepage from './Homepage'
import AccessCode from './AccessCode'


export default function Controller(props) {
    
    return (
        <Router>
            <Switch>
                <Route path="/code">
                    <AccessCode authData={props.authData}/>
                </Route>
                <Route path="/">
                    <Homepage authData={props.authData}/>
                </Route>
            </Switch>
        </Router>
    );
}