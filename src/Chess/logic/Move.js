import Cell from "./Cell";
import Queen from "./Pieces/Queen";

/**
 * This class represents a chess move
 */
class Move {
    oldCell
    newCell

    constructor(oldCell, newCell, piece, isEnPassant = false,
                castle = {isCastle: false}, ate = null, isPromotion = false) {
        this.oldCell = oldCell
        this.newCell = newCell
        this.piece = piece
        this.isEnPassant = isEnPassant
        this.castle = castle
        this.ate = ate
        this.isPromotion = isPromotion
    }

    static getMoveString = (move) => {
        return {
            oldCellRow: move.oldCell.row,
            oldCellCol: move.oldCell.col,
            newCellRow: move.newCell.row,
            newCellCol: move.newCell.col,
            pieceString: move.piece.getString(),
            isEnPassant: move.isEnPassant,
            castle: move.castle.isCastle === false ? {isCastle: false} : {isCastle: true,
                rook:{
                    pieceString : move.castle.rook.piece.getString(),
                    oldCellRow: move.castle.rook.oldCell.row,
                    oldCellCol: move.castle.rook.oldCell.col,
                    newCellRow: move.castle.rook.newCell.row,
                    newCellCol: move.castle.rook.newCell.col,
                }},
            ate: move.ate !== null ? move.ate.getString() : null,
            isPromotion: move.isPromotion
        }
    }
    
    static parseMove = (game, data) => {
        const parseMove = new Move(
            new Cell(data.oldCellRow, data.oldCellCol),
            new Cell(data.newCellRow, data.newCellCol),
            game.board.getPiece(data.oldCellRow, data.oldCellCol),
            data.isEnPassant,
            {isCastle: false}, // TODO : handle
            game.board.getPiece(data.newCellRow, data.newCellCol),
            data.isPromotion
        )
        if (data.isPromotion) {
            game.board.promotePiece(new Queen(game.board.getPiece(data.oldCellRow, data.oldCellCol).colour,
                game.board.getPiece(data.oldCellRow, data.oldCellCol).cell))
        }
        if (data.castle.isCastle) {
            const rookObj = data.castle.rook
            parseMove.castle.isCastle = true
            parseMove.castle.rook = new Move(new Cell(rookObj.oldCellRow, rookObj.oldCellCol)
                , new Cell(rookObj.newCellRow, rookObj.newCellCol), game.board.getPiece(rookObj.oldCellRow, rookObj.oldCellCol))
        }
        return parseMove
    }

}
export default Move