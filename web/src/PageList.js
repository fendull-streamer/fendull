import React, { useState, useEffect } from 'react'
import { Container, Grid } from '@material-ui/core';

export default function PageList(props) {
    const [pages, setPages] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:3011/pages").then(result => result.json()).then(
            jsonData => {
                setPages(jsonData)
            }
        )

    }, [])

    function PageRow(props){
        return(
            <Grid item>
                <a href={"http://localhost:3000/page?key=" + props.data[0]}>{props.data[1]}</a>
            </Grid>
        )
        
    }
    return (
        <Container>
            <Grid direction="column" justifyContent="left">
                {pages.map((page) => {
                    return (
                        <PageRow data={page} />
                    )
                })}
            </Grid>
        </Container>
    )
}