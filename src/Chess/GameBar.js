import React, {useContext, useEffect, useState} from "react";
import "./GameBar.css"
import ChessContext from "./ChessContext";
import Piece from "./logic/Piece";
import Modal from "../components/Modal";
import GameOverModal from "../components/GameOverModal";
import Button from "../components/Button";

const GameBar = () => {
    const chessCtx = useContext(ChessContext)
    const [modalOpen, setModalOpen] = useState(false)
    useEffect(() => {
        if (chessCtx.gameOver) {
            setModalOpen(true)
        }
    }, [chessCtx.gameOver, chessCtx.selectedPiece])

    return (
        <div className="gameBar">
            {modalOpen && <Modal component={
                <GameOverModal
                    colour={chessCtx.selectedPiece !== null && chessCtx.selectedPiece.colour === Piece.BLACK ? "Black" : "White"}
                    closeModal={() => setModalOpen(false)}
                />
            } />}
            <Button onClick={() => chessCtx.newGame()}>New Game</Button>
            <Button onClick={() => chessCtx.undo()}>Undo</Button>
        </div>
    )
}
export default GameBar
