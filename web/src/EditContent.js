import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Container, TextField, Button } from '@material-ui/core';

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue  + ";path=/";
}

export default function EditContent(props) {
    const [markdown, setMarkdown] = useState("");
    const [isEditing, setIsEditing] = useState(true);
    const [title, setTitle] = useState("")

    useEffect(()=> {
        console.log(window.localStorage.getItem("markdown"))
        if (window.localStorage.getItem("markdown") !== null) {
            
            setMarkdown(window.localStorage.getItem("markdown"))
        }
        if (window.localStorage.getItem("title") !== null) {
            setTitle(window.localStorage.getItem("title"))
        }
        
    }, [])

    function handleChange(event){
        console.log(markdown)
        if (event.target.name === "markdown"){
            setMarkdown(event.target.value)
        }   
        if (event.target.name === "title"){
            setTitle(event.target.value)
        }
        
    }


    function tempSave(){
        
        window.localStorage.setItem('markdown', markdown)
        window.localStorage.setItem('title', title)
    }

    return (
        <Container>
        <Button variant="filled" onClick={()=>{
            setIsEditing(!isEditing)
            tempSave()
            }}>Toggle Mode</Button>
        <Button variant="filled" onClick={()=>{
            const URL = "https://api.fendull.com/save"
            fetch(URL, {body: JSON.stringify({content: markdown, key: title, accessToken: props.auth.accessToken}), method: "POST"}).then(result => {
                if (result.status === 400){
                    throw "Invalid auth"
                }
                if (result.status === 500) {
                    throw "Failed to save"
                }
                return result.text()}).then(key => {

                window.location.replace("/page?key=" + title);
            }).catch(err => {
                console.log(err)
                setCookie('page', 'editpage')
                window.location.replace(props.auth.authUrl)
            })
        }}>Save</Button>
            {
                isEditing ? 
                <React.Fragment>
                    <TextField name="title" onChange={handleChange} variant="outlined" label="title" value={title} />
                    <TextField name="markdown" onChange={handleChange} multiline variant='outlined' rows={20} fullWidth={true} value={markdown}/> 
                </React.Fragment>:
                <ReactMarkdown source={markdown} />
            }
        </Container>
    )
}