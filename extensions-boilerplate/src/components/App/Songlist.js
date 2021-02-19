import React, { useState, useEffect } from 'react';
import { Grid, Container, Button, TextField, Chip } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add'
import FendullUtil from './FendullUtil';




export default function Songlist(props){
    const [songList, setSongList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [newSongTitle, setNewSongTitle] = useState("")
    const [newSongArtist, setNewSongArtist] = useState("")
    const [newSongLink, setNewSongLink] = useState("")
    const [newSongTags, setNewSongTags] = useState([])
    const [inlineTag, setInlineTag] = useState("")
    
    
    function isInRequests(songRow) {
        for (var i = 0; i < requestList.length; i++){
            if (songRow[0] === requestList[i][0] && songRow[1] === requestList[i][1]){
                return true;
            }
        }
        return false;
    }

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
        if (event.target.name === "tag"){
            setInlineTag(event.target.value)
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
        fetch("https://srs.fendull.com/requests").then((result) => {
            if (result.ok){
                return result.json()
            }
            return []
            
        }).then(jsonData => {
            setRequestList(jsonData)
        });
    }

    function editSong(songInfoRow){
        setNewSongTitle(songInfoRow[0])
        setNewSongArtist(songInfoRow[1])
        setNewSongLink(songInfoRow[2])
        setNewSongTags(songInfoRow[3])
        deleteSong(songInfoRow[0], songInfoRow[1], props.authData.accessToken)
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
        console.log(authToken)
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
                setNewSongTags([])
            }
            
            if (result.status === 401){
                props.authData.reset();
            }
        })
    }

    function removeTag(tag){
        var newTags = newSongTags;
        newTags.splice(newTags.indexOf(tag), 1)
        console.log(newTags)
        setNewSongTags(newTags);
    }

    function AddedTag(props){
        return (
            <Chip
                variant="outlined"
                onDelete={()=>removeTag(props.label)}
                label={props.label}
            />
        )
    }
    function Tag(props) {
        return (
        <Chip
                variant="outlined"
                label={props.label}
        />);
    }

    function SongInfoRow(props){
        const info = props.info;
        
        
        const canRequest = props.auth.isAuthenticated();
        
        return (
            <Grid container  alignContent="center" className="song-list-row" >
                <Grid xs={3} item >{info[0]}</Grid>
                <Grid xs={3} item>{info[1]}</Grid>
                
                <Grid xs={3} item>{FendullUtil.timeSince(info[4])}</Grid>
                <Grid item xs={3} >
                    {canRequest && <AddIcon variant="filled" onClick={() => {requestSong(info[0], info[1], props.auth.state.token.split('.')[0])}} disabled={props.disabled}/>}
                </Grid>
                
            </Grid>
        )
    }

    useEffect(() => {
        getSongs();
        setInterval(getSongs, 3000);
    }, [])

    return (
        <Container className="table-container">
            
            <div className='song-list-table'>
                <Grid container  direction="row" alignItems="center" className="song-list-row song-list-header">
                    <Grid xs={3} item>Title</Grid>
                    <Grid xs={3} item>Artist</Grid>
                    
                    <Grid xs={3} item>Last Played</Grid>
                    <Grid xs={3} item>Request</Grid>
                </Grid>
                {songList.map((infoRow, idx) =>{
                    return (

                        <SongInfoRow auth={props.auth} key={idx} idx={idx} info={infoRow} authData={props.authData} disabled={isInRequests(infoRow)} />
                    );
                })}
            </div>
        </Container>
    )
}