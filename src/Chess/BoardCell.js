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
        if (isHighlight()) {
            chessCtx.movePiece(row, col)
            return
        }
        if (piece !== null) {
            const moves = piece.getMoves(chessCtx.board)
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
    return (
        <div className={getCSS()} onClick={handleClick}>
            {isHighlight() && <div className="highlight"></div>}
            {piece !== null && <img src={piece.image} className="boardPiece"/>}
        </div>
    )
}
export default BoardCell
