import React, {useContext, useEffect, useState} from "react";
import "./GameBar.css"
import ChessContext from "./ChessContext";
import Modal from "../components/Modal";
import GameOverModal from "../components/GameOverModal";
import Button from "../components/Button";
import Piece from "./logic/Piece";

const GameBar = () => {
    const chessCtx = useContext(ChessContext)
    const [modalOpen, setModalOpen] = useState(false)
    useEffect(() => {
        if (chessCtx.gameOver.isGameOver) {
            setModalOpen(true)
        }
    }, [chessCtx.gameOver, chessCtx.selectedPiece])

    const showButtons = !chessCtx.game.board.moves.length >0 && !chessCtx.ai

    return (
        <div className="gameBar">
            {modalOpen && <Modal component={
                <GameOverModal
                    message={chessCtx.gameOver.message}
                    closeModal={() => setModalOpen(false)}
                />
            } />}

            <Button onClick={() => chessCtx.newGame()}>New Game</Button>
            {<Button onClick={() => chessCtx.undo()}>Undo</Button>}
            {showButtons && <Button onClick={() => chessCtx.toggleEngine()}>Engine on</Button>}
            {showButtons && "Play as: "}
            {showButtons && <select value={chessCtx.aiColour}
                onChange={(e) => chessCtx.setAiColour(parseInt(e.target.value))}>
                <option value={Piece.BLACK}>White</option>
                <option value={Piece.WHITE}>Black</option>
            </select>}
            {showButtons && "Depth: "}
            {showButtons &&
                <select value={chessCtx.depth}
                    onChange={(e) => chessCtx.setDepth(parseInt(e.target.value))}>
                    <option value={2}>easiest</option>
                    <option value={3}>easier</option>
                <option value={4}>medium, qsearch</option>
                    <option value={5}>medium, slow</option>
            </select>}
        </div>
    )
}
export default GameBar
