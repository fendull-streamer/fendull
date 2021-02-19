import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Container, Button } from '@material-ui/core'

export default function Page(props) {
    const [markdown, setMarkdown] = useState("");

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get("key")
        const URL = "https://api.fendull.com/view?key=" + key;

        fetch(URL).then(result => result.text()).then(data => {
            console.log(data);
            setMarkdown(data)
        })
    }, [])
    const editPage = function() {
        const urlParams = new URLSearchParams(window.location.search);
        window.localStorage.setItem('markdown', markdown)
        window.localStorage.setItem('title', urlParams.get("key"));
        window.location.replace("/editpage");
    }
    var username;
    try {
         username = props.auth.idToken.preferred_username;
    }catch {
         username = "";
    }
    return (
        <Container>
            {username === "fendull" && <Button onClick={editPage}>Edit</Button>}
            <ReactMarkdown source={markdown} />
        </Container>
    )

    
}