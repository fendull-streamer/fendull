import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Homepage from './Homepage'
import AccessCode from './AccessCode'
import SongRequestPage from './SongRequestPage'
import RequestListPage from './RequestListPage'
import Header from './Header';
import NowPlaying from './NowPlaying'
import TileGamePage from './TileGamePage'
import EditContent from './EditContent'
import PageList from './PageList'
import Page from './Page'


export default function Controller(props) {
    
    return (
        <Router>
            <Switch>
                <Route path="/ext">
                    <Switch>
                        <Route path="/nowplaying">
                            <NowPlaying />
                        </Route>
                        <Route path="*">
                            <NowPlaying />
                        </Route>
                    </Switch>
                </Route>
                <Route path="*">
                    <Header authData={props.authData}/>
                    <Switch>
                        <Route path="/page" >
                            <Page auth={props.authData} />
                        </Route>
                        <Route path="/pages" >
                            <PageList auth={props.authData} />
                        </Route>
                        <Route path="/editpage">
                            <EditContent auth={props.authData}/>
                        </Route>
                        <Route path="/requestlist">
                            <RequestListPage authData={props.authData} />
                        </Route>
                        <Route path="/songlist">
                            <SongRequestPage authData={props.authData}/>
                        </Route>
                        <Route path="/code">
                            <AccessCode authData={props.authData}/>
                        </Route>
                        <Route path="/tile">
                            <TileGamePage authData={props.authData} />
                        </Route>
                        <Route path="/">
                            <Homepage authData={props.authData}/>
                        </Route>
                    </Switch>
                </Route>
                
            </Switch>
        </Router>
    );
}