import React, { useState, useEffect } from 'react';
import { Grid, Container, Button, TextField } from '@material-ui/core';
import FendullUtil from './FendullUtil'
import { useHistory } from "react-router-dom";

export default function SongRequestPage(props){
    const [songList, setSongList] = useState([]);
    const [newSongTitle, setNewSongTitle] = useState("")
    const [newSongArtist, setNewSongArtist] = useState("")
    const [newSongLink, setNewSongLink] = useState("")
    const [newSongTags, setNewSongTags] = useState(["Classical"])
    const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
    const history = useHistory();
    console.log(songList)
    function handleChange(event){
        
        if (event.target.name === "title"){
            setNewSongTitle(event.target.value)
        }
        if (event.target.name === "artist"){
            setNewSongArtist(event.target.value)
        }
        if (event.target.name === "link"){
            setNewSongLink(event.target.value)
        }
    }

    function getSongs(){
        fetch("https://srs.fendull.com/songs").then((result) => {
            if (result.ok){
                return result.json()
            }
            return []
            
        }).then(jsonData => {
            setSongList(jsonData)
        });
    }
    function deleteSong(title, by, authToken) {
        
        const body = {
            title: title,
            by: by,
            auth_token: authToken
        }
        
        fetch("https://srs.fendull.com/deletesong", {
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

    function requestSong(title, by, authToken) {
        
        const body = {
            title: title,
            by: by,
            auth_token: authToken
        }
        
        fetch("https://srs.fendull.com/requestsong", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.ok){
                getSongs()
                history.push('/requestlist')
            }
            
            if (result.status === 401){
                props.authData.setAuthorized(false);
            }
        })
    }


    function addSong(title, by, link, tags, auth_token) {
        const body = {
            title: title,
            by: by,
            auth_token: auth_token,
            link: link,
            tags: tags
        }
        fetch("https://srs.fendull.com/addsong", {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.ok){
                getSongs()
                setNewSongArtist("")
                setNewSongTitle("")
                setNewSongLink("")
            }
            
            if (result.status === 401){
                props.authData.reset();
            }
        })
    }


    function SongInfoRow(props){
        const info = props.info;
        const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
        const canRequest = (props.authData.idToken != null);
        
        const color = props.idx % 2 == 0 ? "#dddddd" : "#aaaaaa"
        
        
        return (
            <Grid container item direction="row" alignItems="center" className="song-list-row" style={{backgroundColor: color}}>
                <Grid xs={2} item>{info[0]}</Grid>
                <Grid xs={2} item>{info[1]}</Grid>
                <Grid xs={2} item><a href={info[2]}>Sheet Music</a></Grid>
                <Grid xs={2} item>{info[3]}</Grid>
                <Grid xs={2} item>{FendullUtil.timeSince(info[4])}</Grid>
                <Grid item xs={1} >
                    {canRequest && <Button onClick={() => {requestSong(info[0], info[1], props.authData.accessToken)}}>Request</Button>}
                </Grid>
                <Grid xs={1} item>
                    {canEdit && <Button onClick={() => {deleteSong(info[0], info[1], props.authData.accessToken)}}>Delete</Button>}
                </Grid> 
            </Grid>
        )
    }

    useEffect(() => {
        getSongs();
    }, [])

    return (
        <Container>
            <Grid container direction="row" className = "add-song" alignItems="center" spacing={2}>
                <Grid xs={3} item><TextField value={newSongTitle} name="title" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={2} item><TextField value={newSongArtist} name="artist" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={2} item><TextField value={newSongLink} name="link" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={4} item>{newSongTags.toString()}</Grid>
                
                <Grid xs={1} item>
                    {canEdit && <Button onClick={() => {addSong(newSongTitle, newSongArtist, newSongLink, newSongTags, props.authData.accessToken)}}>Add</Button>}
                </Grid>
            </Grid>
            <Grid container direction="column" className="song-list-table">
                <Grid container item direction="row" alignItems="center" className="song-list-row song-list-header">
                    <Grid xs={2} item>Title</Grid>
                    <Grid xs={2} item>Artist</Grid>
                    <Grid xs={2} item>Sheet Music Link</Grid>
                    <Grid xs={2} item>Tags</Grid>
                    <Grid xs={2} item>Last Played</Grid>
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