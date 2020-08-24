import React from 'react';
import { Container, Typography } from '@material-ui/core';

export default function AccessCode(props){
    return (
        <Container>
            <Typography>Your access code is:</Typography>
            <code>{props.authData.accessToken}</code>
        </Container>
    );
}