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
            {!chessCtx.game.board.moves.length >0 && !chessCtx.ai && <Button onClick={() => chessCtx.toggleEngine()}>Engine on</Button>}
            {!chessCtx.game.board.moves.length >0 && !chessCtx.ai && "Play as: "}
            {!chessCtx.game.board.moves.length >0 && !chessCtx.ai && <select value={chessCtx.aiColour}
                onChange={(e) => chessCtx.setAiColour(parseInt(e.target.value))}>
                <option value={Piece.BLACK}>White</option>
                <option value={Piece.WHITE}>Black</option>
            </select>}
            {!chessCtx.game.board.moves.length >0 && !chessCtx.ai && "Depth: "}
            {!chessCtx.game.board.moves.length >0 && !chessCtx.ai &&
                <select value={chessCtx.depth}
                    onChange={(e) => chessCtx.setDepth(parseInt(e.target.value))}>
                <option value={3}>3 (easier)</option>
                <option value={4}>4 (easy)</option>
            </select>}
        </div>
    )
}
export default GameBar
