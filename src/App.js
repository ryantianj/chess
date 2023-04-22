import './App.css';
import Chess from "./Chess/Chess";
import {ChessContextProvider} from "./Chess/ChessContext";
import GameBar from "./Chess/GameBar";
import MoveBar from "./Chess/MoveBar/MoveBar"
import React from "react";
import Player from "./Chess/Player";
import Piece from "./Chess/logic/Piece";

function App() {
  return (
    <div className="App">
        <ChessContextProvider>
            <Player colour={Piece.BLACK}/>
            <Chess />
            <Player colour={Piece.WHITE}/>
            <MoveBar />
            <GameBar />
        </ChessContextProvider>
    </div>
  );
}

export default App;
