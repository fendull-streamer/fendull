import React, { useState, useEffect } from 'react'
import { Fab, Grid, Tabs, Tab } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Songlist from './Songlist'

export default function Menu(props){
    const [menuOpen, setMenuOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [jwt, setJwt] = useState("");

    

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
      };

    var purpleBackground = {backgroundColor: "rgba(85, 2, 85, 0.5)"}
    return (
        <Grid container direction="column" className="menu">
            <Grid container item direction="row" >
                <Grid item xs={1} style={menuOpen ? purpleBackground : {}}>
                    <Fab size="small" onClick={()=>{setMenuOpen(!menuOpen)}} >
                        <MenuIcon />
                    </Fab>
                </Grid>
                {
                menuOpen && 
                <Grid item  xs={11} className="menu-row">
                    <Tabs value={tabIndex} onChange={handleChange} >
                        <Tab label="Songlist" />
                        <Tab label="Queue" />
                    </Tabs>
                </Grid>  
            }
            </Grid>
            {
                menuOpen && 
                <Grid item className="menu-row">
                    {tabIndex === 0 && (
                        <Songlist auth={props.auth}/>
                    )
                    }
                    {tabIndex === 1 && (
                        <div>{jwt}</div>
                    )
                    }
                </Grid>  
            }
                     
        </Grid>
    )
}

