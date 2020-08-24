import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography } from '@material-ui/core'

function DataList(props) {
    return (
    <Grid container direction="column"> 
        {props.data.data.map(item => {
            return (<Grid container direction="row">
                <Grid item xs={7}>{item[0]}</Grid>
                <Grid item xs={5}>{item[1]}</Grid>
            </Grid>)
        })}
    </Grid>)
}

export default function Homepage(props) {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch("https://api.fendull.com/challenges", {mode: 'cors'}).then(result => result.json()).then(data => {
            console.log(data)
            setData(data)
        })
    }, [])

    return (
        <Container>
            <Typography>Check out Fendull's stream at <a href="https://twitch.tv/fendull">https://twitch.tv/fendull</a></Typography>
            {data && <DataList data={data}/>}
        </Container>
    )
}