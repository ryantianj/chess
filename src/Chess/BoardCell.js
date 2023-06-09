import React, {useContext} from "react";
import "./Board.css"
import ChessContext from "./ChessContext";
import Queen from "./logic/Pieces/Queen";
import Rook from "./logic/Pieces/Rook";
import Knight from "./logic/Pieces/Knight";
import Bishop from "./logic/Pieces/Bishop";
import Piece from "./logic/Piece";

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
        if (ishighlight && !chessCtx.promotion) { // move piece to valid square
            chessCtx.movePiece(row, col)
            return
        }
        if (chessCtx.game.turnColour !== piece.colour) { // not the turn
            return
        }
         // set moves of a piece
        const moves = piece.getMoves(chessCtx.game.board)
        chessCtx.setMoves(moves, piece)

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
        if (chessCtx.selectedPiece !== null && chessCtx.selectedPiece.cell.row === row && chessCtx.selectedPiece.cell.col === col) {
            style += " focus"
        }
        if (chessCtx.game.board.moves.length > 0) {
            const lastMove = chessCtx.game.board.moves.slice(-1)[0]
            const newCell = lastMove.newCell
            if (newCell.row === row && newCell.col === col) {
                if (lastMove.ate !== null) {
                    style += " ate"
                } else {
                    style += " focus"
                }

            }
            const oldCell = lastMove.oldCell
            if (oldCell.row === row && oldCell.col === col) {
                style += " from"
            }
        }
        return style
    }

    const handlePromote = (pc) => {
        chessCtx.promote(pc)
    }

    const getPromote = () => {
        const pieces = [new Queen(piece.colour, piece.cell), new Rook(piece.colour, piece.cell)
            , new Knight(piece.colour, piece.cell), new Bishop(piece.colour, piece.cell)]

        return pieces.map((pc, i) =>
            <img src={pc.image} alt={"piece"} key={i} className="promotionPiece" style={chessCtx.aiColour === Piece.WHITE ? {transform: "rotateX(180deg) rotateY(180deg)"} :{}}
                 onClick={() => handlePromote(pc)}/>
        )
    }
    const handleDrag = (e) => {
        e.dataTransfer.effectAllowed = "copyMove"; // remove green plus sign on browser
        if (chessCtx.game.turnColour !== piece.colour) { // not the turn
            return
        }
        // get moves first
        const moves = piece.getMoves(chessCtx.game.board)
        chessCtx.setMoves(moves, piece)
        e.dataTransfer.setData("text", e.target.id)

    }
    const allowDrop = (e) => {
        e.preventDefault()
    }
    const handleDrop = (e) => {
        e.preventDefault()
        if (isHighlight()) { // is valid move
            handleClick()
        }
    }
    return (
        <button className={getCSS()} onDragOver={allowDrop} onDrop={handleDrop}
                onClick={handleClick}
                disabled={chessCtx.ai && piece !== null && piece.colour === chessCtx.aiColour && chessCtx.game.turnColour === chessCtx.aiColour}
        >
            {isHighlight() && <div className="highlight"></div>}
            {chessCtx.promotion && chessCtx.promotionDetails.row === row && chessCtx.promotionDetails.col === col
                && <span className="tooltip">{getPromote()}</span>}
            {piece !== null && <img
                id={row + " " + col}
                src={piece.image}
                style={chessCtx.aiColour === Piece.WHITE ? {transform: "rotateX(180deg) rotateY(180deg)"} :{}}
                className="boardPiece"
                alt={"piece"}
                draggable={chessCtx.ai && piece !== null && piece.colour === chessCtx.aiColour ? "false" : "true"} onDragStart={handleDrag}
            />}
            {chessCtx.aiColour === Piece.WHITE
                ? row === 0 && <p className="alphabetCoord"  style={chessCtx.aiColour === Piece.WHITE ? {transform: "rotateX(180deg) rotateY(180deg)", bottom: "55%", left:"-80%"} :{}}>{String.fromCharCode(col + 97)}</p>
                : row === 7 && <p className="alphabetCoord">{String.fromCharCode(col + 97)}</p>}
            {chessCtx.aiColour === Piece.WHITE
                ? col === 7 && <p className="numberCoord"  style={chessCtx.aiColour === Piece.WHITE ? {transform: "rotateX(180deg) rotateY(180deg)", top: "55%", right: "-80%"} :{}}>{String.fromCharCode(56 - row)}</p>
                : col === 0 && <p className="numberCoord">{String.fromCharCode(56 - row)}</p>}
        </button>
    )
}
export default BoardCell
