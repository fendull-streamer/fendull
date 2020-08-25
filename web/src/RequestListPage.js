import React, { useState, useEffect } from 'react';
import { Grid, Container, Button, TextField } from '@material-ui/core';
import FendullUtil from './FendullUtil'

export default function SongRequestPage(props){
    const [songList, setSongList] = useState([]);
    
    const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
   

    function getSongs(){
        fetch("https://srs.fendull.com/requests").then(result => result.json()).then(jsonData => {
            setSongList(jsonData)
        });
    }

    function playSong(title, by, authToken){
        const body = {
            title: title,
            by: by,
            auth_token: authToken
        }
        
        fetch("https://srs.fendull.com/playsong", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.ok){
                getSongs()
            }
            
            if (result.status === 401){
                props.authData.setAuthorized(false);
            }
        })
    }

    function finishPlaying(authToken){
        const body = {
            auth_token: authToken
        }
        
        fetch("https://srs.fendull.com/finishsong", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.ok){
                getSongs()
            }
            
            if (result.status === 401){
                props.authData.setAuthorized(false);
            }
        })
    }


    function SongInfoRow(props){
        const info = props.info;
        const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
        const canRequest = (props.authData.idToken != null);
        const row_num = props.key;
        console.log(row_num)
        const color = props.idx % 2 == 0 ? "#dddddd" : "#aaaaaa"
        console.log(info)
        if (!canEdit && info[5] === "playing"){
            return
        }
        return (
            <Grid container item direction="row" alignItems="center" className="song-list-row" style={{backgroundColor: color}}>
                <Grid xs={2} item>{info[0]}</Grid>
                <Grid xs={2} item>{info[1]}</Grid>
                <Grid xs={2} item><a href={info[2]}>Sheet Music</a></Grid>
                <Grid xs={2} item>{info[3]}</Grid>
                <Grid xs={2} item>{FendullUtil.timeSince(info[4])}</Grid>
                <Grid item xs={2} >
                    {canEdit && info[5] !== "playing" && <Button onClick={()=>{playSong(info[0], info[1], props.authData.accessToken)}}>Play</Button>}
                    {canEdit && info[5] === "playing" && <Button onClick={()=>{finishPlaying(props.authData.accessToken)}}>Finish</Button>}
                </Grid>
                 
            </Grid>
        )
    }

    useEffect(() => {
        getSongs();
    }, [])

    return (
        <Container>
            <Grid container direction="column" className="song-list-table">
                <Grid container item direction="row" alignItems="center" className="song-list-row song-list-header">
                    <Grid xs={2} item>Title</Grid>
                    <Grid xs={2} item>Artist</Grid>
                    <Grid xs={2} item>Sheet Music Link</Grid>
                    <Grid xs={2} item>Requested By</Grid>
                    <Grid xs={2} item>Time Since Requested</Grid>
                    <Grid item xs={2} >
                        Actions
                    </Grid>
                </Grid>
                {songList.map((infoRow, idx) =>{
                    return (
                        <SongInfoRow key={idx} idx={idx} info={infoRow} authData={props.authData} />
                    );
                })}
            </Grid>
        </Container>
    )
}