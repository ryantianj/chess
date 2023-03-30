import './App.css';
import Chess from "./Chess/Chess";
import {ChessContextProvider} from "./Chess/ChessContext";
import GameBar from "./Chess/GameBar";
import React from "react";

function App() {
  return (
    <div className="App">
        <ChessContextProvider>
            <Chess />
            <GameBar />
        </ChessContextProvider>
    </div>
  );
}

export default App;
