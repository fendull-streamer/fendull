import React, { useEffect, useState } from 'react'
import { Container, Grid, Button } from '@material-ui/core'

function hashCode(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    console.log(h)
    return h;
  };
function generateHex(name){
    const out = Math.floor((Math.abs(Math.sin(hashCode(name)) * 16777215)) % 16777215).toString(16);
    console.log(out);
    return out
}

function TileGameBoardCell(props){
    return (
        <Grid item className="tile-game-cell" style={props.item!==null ? {backgroundColor: "#" + generateHex(props.item) }: {}}>
            
        </Grid>
    )
}

function TileGameBoardRow(props){
    return (
        <Grid item container direction="row" className="tile-game-row">
            {
                props.row.map((item)=>{
                    return (
                        <TileGameBoardCell item={item} />
                    )
                })
            }
        </Grid>
    )
}

function TileGameBoard(props){
    
    return (
        <React.Fragment>
        {props.grid.map((gridRow) => {
            return (
                <TileGameBoardRow row={gridRow} />
            )
        })}
        </React.Fragment>
    )
}

function ScoresList(props){
    var playerScores = Object.keys(props.playerData).map((key)=>{
        return [key, props.playerData[key]['points']]
    }).sort((a,b) => {
        if (a[1] < b[1]){
            return -1;
        }
        return 1
    })

    return (
        <Grid container direction="column">
            {
                playerScores.map((playerScore, index)=> {
                    return (
                        <Grid key={index} item container direction="row" spacing={2} alignItems="center">
                            <TileGameBoardCell item={playerScore[0]} />
                            <Grid item>{playerScore[0]}</Grid>
                            <Grid item>{playerScore[1]}</Grid>
                        </Grid>

                    )
                })
            }

        </Grid>
    )
}

export default function TileGamePage(props){

    const [gameData, setGameData] = useState({grid: [[]], player: {}});
    
    function updateGameData(){
        fetch("https://1k7c2ivnwa.execute-api.us-west-2.amazonaws.com/status").then(result => result.json()).then(
            jsonData => {
                setGameData(jsonData);
            }
        )
    }
    useEffect(()=>{
        updateGameData()
        setInterval(updateGameData, 3000)
    }, [])
    return (
        <Container>
            
            <Grid direction="row">
                <Grid item xs={9}>
                    <TileGameBoard grid={gameData.grid} />
                </Grid>
                <Grid item>
                    <ScoresList playerData={gameData.player} />
                </Grid>
            </Grid>
            
        </Container>
    )
}