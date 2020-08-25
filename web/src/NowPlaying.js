import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';

export default function NowPlaying(props){
    const [songData, setSongData] = useState(null);
    function SongInfoRow(props){
        const info = props.info;
        
        
        return (
            <Grid container direction ="column">
                <Grid container item direction="row" alignItems="center" className="now-playing-row">
                    <Grid xs={2} item>Title</Grid>
                    <Grid xs={2} item>Artist</Grid>
                    <Grid xs={2} item>Requested By</Grid>
                </Grid>
                <Grid container item direction="row" alignItems="center" className="now-playing-row">
                    <Grid xs={2} item>{info[0]}</Grid>
                    <Grid xs={2} item>{info[1]}</Grid>
                    <Grid xs={2} item>{info[3]}</Grid>
                </Grid>
            </Grid>
        )
    }
    useEffect(() => {
        fetch("https://srs.fendull.com/nowplaying").then(result => { return result.text()}).then(text =>{
            console.log(text)
            if (text){
                setSongData(JSON.parse(text))
            }

            
        })
    }, [])
    if (songData === null)
        return <div>Nothing Playing</div>
    return (
        <SongInfoRow info={songData} />
    )
}