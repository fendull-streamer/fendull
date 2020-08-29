import React from 'react'
import { Grid, Typography } from '@material-ui/core';

export default function Header (props){
    return (
        <Grid container direction="row" className="header">
            <Grid item xs={2}>Fendull</Grid>
            <Grid item xs={1}><a href="/songlist" className="header-link">Song List</a></Grid>
            <Grid item xs={7}><a href="/requestlist" className="header-link">Request List</a></Grid>
            <Grid item xs={2} className="twitch-sign-in">
            {props.authData.authorized ? 
                <Typography>{props.authData.idToken.preferred_username}</Typography> :
                <a href={props.authData.authUrl}>Sign In</a>}
            </Grid>
        </Grid>
    )
}