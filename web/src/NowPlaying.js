import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';

export default function NowPlaying(props){
    const [songData, setSongData] = useState(null);
    function SongInfoRow(props){
        const info = props.info;
        
        
        return (
            
                <Grid container item direction="row" alignItems="center" className="now-playing-row">
                    <Grid xs={9} item container direction="column" className="title-and-artist">
                        <Grid item className="now-playing-title">
                            {info[0]}
                        </Grid>
                        <Grid item className="now-playing-artist">
                            {info[1]}
                        </Grid>
                    </Grid>
                    <Grid xs={2} item className="now-playing-requester">Requested By: {info[3]}</Grid>
                </Grid>
               
            
        )
    }
    useEffect(() => {
        setInterval(() =>{
            fetch("https://srs.fendull.com/nowplaying").then(result => { return result.text()}).then(text =>{
                console.log(text)
                if (text){
                    setSongData(JSON.parse(text))
                }
    
                
            })
        }, 1000)
       
    }, [])
    return (
        <div className="now-playing-container">
            {songData !== null ? <SongInfoRow info={songData} /> : "Nothing Playing"}
        </div>
    )
}