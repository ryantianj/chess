import React, {useContext} from "react";
import "./Board.css"
import ChessContext from "./ChessContext";

const BoardCell = ({row, col, piece}) => {
    const chessCtx = useContext(ChessContext)

    const isHighlight = () => {
        for (const cell of chessCtx.highlightCell) {
            if (cell.newCell.row === row && cell.newCell.col === col) {
                return true
            }
        }
        return false
    }

    const handleClick = () => {
        const ishighlight = isHighlight()
        if (!ishighlight && piece == null) { // cell is empty, and current selection does not cover cell
            return;
        }
        if (ishighlight) { // move piece to valid square
            chessCtx.movePiece(row, col)
            return
        }
        if (chessCtx.game.turnColour !== piece.colour) { // not the turn
            return
        }
        if (piece !== null) { // set moves of a piece
            const moves = piece.getMoves(chessCtx.game.board)
            chessCtx.setMoves(moves, piece)
        }
    }
    const getCSS = () => {
        const rowIsEven = row % 2 === 0
        const colIsEven = col % 2 === 0
        let style = ""

        if (rowIsEven && colIsEven) {
            style += "cell whiteCell"
        }
        if (!rowIsEven && !colIsEven) {
            style += "cell whiteCell"
        }
        if (rowIsEven && !colIsEven) {
            style += "cell greenCell"
        }
        if (!rowIsEven && colIsEven) {
            style += "cell greenCell"
        }
        return style
    }

    const getPromote = () => {
        // put pieces here, map images
        return []
    }
    return (
        <div className={getCSS()} onClick={handleClick}>
            {isHighlight() && <div className="highlight"></div>}
            {chessCtx.promotion && chessCtx.promotionDetails.row === row && chessCtx.promotionDetails.col === col
                && <span className="tooltip">{getPromote()}</span>}
            {piece !== null && <img src={piece.image} className="boardPiece"/>}
        </div>
    )
}
export default BoardCell
