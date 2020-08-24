import React from 'react'
import { Grid, Typography } from '@material-ui/core';

export default function Header (props){
    console.log(props.authData.idToken)
    return (
        <Grid container direction="row" className="header">
            <Grid item xs={10}>Fendull</Grid>
            <Grid item xs={2}>
            {props.authData.authorized ? 
                <Typography>{props.authData.idToken.preferred_username}</Typography> :
                <a href={props.authData.authUrl}>Sign In</a>}
            </Grid>
        </Grid>
    )
}