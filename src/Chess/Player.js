import React, {useContext} from "react";
import "./Player.css"
import Piece from "./logic/Piece";
import ChessContext from "./ChessContext";
import Clock from "../components/Clock";

const Player = ({colour}) => {
    const chessCtx = useContext(ChessContext)

    const playerStyle = () => {
        if (chessCtx.game.turnColour === colour) {
            return {backgroundColor: "lightgreen"}
        }
    }
    const getScore = () => {
        const whitePieces = chessCtx.game.getEatenPieces(Piece.WHITE).map(piece => piece.points)
        let whiteSum = 0
        for (const score of whitePieces) {
            whiteSum+=score
        }
        const blackPieces = chessCtx.game.getEatenPieces(Piece.BLACK).map(piece => piece.points)
        let blackSum = 0
        for (const score of blackPieces) {
            blackSum += score
        }
        const diff = whiteSum - blackSum
        if (diff > 0 && colour === Piece.WHITE) {
            return "+" + diff
        } else if (diff < 0 && colour === Piece.BLACK) {
            return "+" + -1 * diff
        }
            return ""

    }
    return (
        <div style={playerStyle()} className="player">
            <div className="info">
                <p>{chessCtx.ai && colour === Piece.BLACK? "Stockfish's little brother v3" : colour === Piece.BLACK ? "Black" : "White"}</p>
                <div className="eatenPieces">
                    {chessCtx.game.getEatenPieces(colour)
                        .map((piece, i) => <img src={piece.image} alt={"piece"} key={i} className="eatenPiece"/>)}
                    {getScore()}
                </div>
            </div>
            <div className="clock">
                <Clock colour={colour}/>
            </div>
        </div>
    )
}
export default Player
