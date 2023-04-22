import React from "react";
import "./MoveBar.css"
import Piece from "../logic/Piece";

const Move = ({move, idx}) => {
    const col = move.newCell.col
    const row = move.newCell.row
    const colString = String.fromCharCode(col + 97)
    const rowString = String.fromCharCode(56 - row)

    const getCSS = () => {
        if (move.piece.colour === Piece.BLACK) {
            return "moveWrapper blackMove"
        }
        return "moveWrapper"
    }
    const moveString = () => {
        let result = ""
        if (move.ate !== null) {
            const oldCol = move.oldCell.col
            const oldColString = String.fromCharCode(oldCol + 97)
            result+= oldColString + "x"
        }
        let promotion = ""
        if (move.isPromotion && move.promotionPiece !== undefined) {
            promotion += "=" + move.promotionPiece.getString().slice(1,2).toUpperCase()
        }
        if (move.castle.isCastle) {
            if (col === 6) { // kingside
                return "O-O"
            }
            return "O-O-O"
        }
        let isCheck = ""
        if (move.isCheck) {
            isCheck += "+"
        }
        return result + colString + rowString + promotion + isCheck
    }

    return (
        <div className={getCSS()}>
            <span>{idx + 1}.</span>
            <img src={move.piece.image} alt={move.piece.image} className="moveImage"/>
            <span>{moveString()}</span>
        </div>
    )
}
export default Move
