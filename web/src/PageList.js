import React, { useState, useEffect } from 'react'
import { Container, Grid } from '@material-ui/core';

export default function PageList(props) {
    const [pages, setPages] = useState([]);

    useEffect(()=>{
        fetch("https://api.fendull.com/listPages").then(result => result.json()).then(
            jsonData => {
                console.log(jsonData)
                setPages(jsonData)
            }
        )

    }, [])

    function PageRow(props){
        return(
            <Grid item>
                <a href={"/page?key=" + props.data}>{props.data}</a>
            </Grid>
        )
        
    }
    return (
        <Container>
            <Grid direction="column" justifyContent="left">
                
                {pages.length > 0 ? pages.map((page) => {
                    console.log(page)
                    return (
                        <PageRow data={page} />
                    )
                }) : "Loading Pages..."}
            </Grid>
        </Container>
    )
}