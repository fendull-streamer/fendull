import React, { useState, useEffect } from 'react';
import { Grid, Container, Button, TextField, Chip } from '@material-ui/core';
import FendullUtil from './FendullUtil'
import { useHistory } from "react-router-dom";

export default function SongRequestPage(props){
    const [songList, setSongList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [newSongTitle, setNewSongTitle] = useState("")
    const [newSongArtist, setNewSongArtist] = useState("")
    const [newSongLink, setNewSongLink] = useState("")
    const [newSongTags, setNewSongTags] = useState([])
    const [inlineTag, setInlineTag] = useState("")
    const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
    const history = useHistory();
    
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
            <span>label={props.label}</span>
        );
    }

    function SongInfoRow(props){
        const info = props.info;
        const canEdit = (props.authData.idToken != null && props.authData.idToken.preferred_username === "fendull");
        const canRequest = (props.authData.idToken != null);

        return (
            <div className="song-list-row">
                {canEdit ? <div className="title" onClick={()=>{editSong(props.info)}}>{info[0]}</div> : <div className="title">{info[0]}</div>}
                <div className="artist">{info[1]}</div>
                <div className="sheet"><a href={info[2]}>Sheet Music</a></div>
                <div className="tags">{info[3].map((tag) => {
                    return (<span className="tag">{tag}</span>)
                })}</div>
                <div className="played">{FendullUtil.timeSince(info[4])}</div>
                <div className="actions">
                    {canRequest && <Button onClick={() => {requestSong(info[0], info[1], props.authData.accessToken)}} disabled={props.disabled}>Request</Button>}
                    {canEdit && <Button onClick={() => {deleteSong(info[0], info[1], props.authData.accessToken)}}>Delete</Button>}
                </div> 
            </div>
        )
    }

    useEffect(() => {
        getSongs();
        setInterval(getSongs, 3000);
    }, [])

    return (
        <Container>
            <div style={{marginBottom: 10}}>
            <Grid container direction="row" className = "add-song" alignItems="center" spacing={2}>
                <Grid xs={2} item><TextField value={newSongTitle} name="title" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={2} item><TextField value={newSongArtist} name="artist" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={2} item><TextField value={newSongLink} name="link" onChange={handleChange} variant="outlined" /></Grid>
                <Grid xs={2} item><TextField value={inlineTag} name="tag" onChange={handleChange} variant="outlined"></TextField></Grid>
                <Grid xs={1}><Button onClick={()=>{
                    var new_tags = newSongTags;
                    console.log(newSongTags);
                    console.log(new_tags)
                    new_tags.push(inlineTag)
                    setNewSongTags(new_tags);
                    setInlineTag("")
                }}>Add Tag</Button></Grid>
                <Grid xs={1} item>{newSongTags.map((tag)=>{
                    return (<AddedTag label={tag}/>)
                })}</Grid>
                
                <Grid xs={1} item>
                    {canEdit && <Button onClick={() => {addSong(newSongTitle, newSongArtist, newSongLink, newSongTags, props.authData.accessToken)}}>Add</Button>}
                </Grid>
            </Grid>
            </div>
            <div className="song-list-table">
                <div className="song-list-row song-list-header">
                    <div className="title">Title</div>
                    <div className="artist">Artist</div>
                    <div className="sheet">Sheet Music</div>
                    <div className="tags">Tags</div>
                    <div className="played">Last Played</div>
                    <div className="actions">Actions</div>
                </div>
                {songList.map((infoRow, idx) =>{
                    return (
                        <SongInfoRow key={idx} idx={idx} info={infoRow} authData={props.authData} disabled={isInRequests(infoRow)} />
                    );
                })}
            </div>
        </Container>
    )
}