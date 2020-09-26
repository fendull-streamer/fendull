import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Container } from '@material-ui/core'

export default function Page(props) {
    const [markdown, setMarkdown] = useState("");

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get("key")
        const URL = "http://localhost:3011/view?key=" + key;

        fetch(URL).then(result => result.text()).then(data => {
            setMarkdown(data)
        })
    }, [])

    return (
        <Container>
            <ReactMarkdown source={markdown} />
        </Container>
    )

    
}