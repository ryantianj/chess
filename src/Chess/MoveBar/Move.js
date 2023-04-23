import React from "react";
import "./MoveBar.css"
import Piece from "../logic/Piece";

const Move = ({move, idx}) => {
    let col = move.newCell.col
    let row = move.newCell.row
    let colString = String.fromCharCode(col + 97)
    let rowString = String.fromCharCode(56 - row)

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
            const oldRow = move.oldCell.row
            const oldRowString = String.fromCharCode(56 - oldRow)
            result+= oldColString + oldRowString + "x"
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
        if (move.isEnPassant) {
            row += move.piece.colour * -1
            rowString = String.fromCharCode(56 - row)
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
