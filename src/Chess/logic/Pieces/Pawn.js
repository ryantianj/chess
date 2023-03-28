import Piece from "../Piece"
import imageWhite from "../../images/wp.png"
import imageBlack from "../../images/bp.png"
import Move from "../Move"
import Cell from "../Cell";
class Pawn extends Piece {
    #pieceMoves = [[1,0],[2,0],[1,1],[1,-1]] // en passant is same as a normal capture

    constructor(colour, cell, moves) {
        super(colour, cell, moves)
        if (colour === Piece.WHITE) {
            this.image = imageWhite
        } else {
            this.image = imageBlack
        }
    }

    /**
     * Returns valid moves of a piece (the coordinates)
     * @param board chess board, array
     */
    getMoves = (board) => {
        const moves = []
        // move one space == nothing on that space
        let newRow = this.cell.row + 1 * this.colour
        let newCol = this.cell.col
        if (!board.isOutSide(newRow, newCol) && board.isEmpty(newRow, newCol)) {
            moves.push(new Move(this.cell, new Cell(newRow, newCol)))
            newRow = this.cell.row + 2 * this.colour
            if (!board.isOutSide(newRow, newCol) && board.isEmpty(newRow, newCol) && this.moves.length <= 0) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol)))
            }
        }
        newRow = this.cell.row + 1 * this.colour
        newCol = this.cell.col + 1 * this.colour
        if (!board.isOutSide(newRow, newCol) && !board.isEmpty(newRow, newCol) && board.getPiece(newRow, newCol).colour !== this.colour) {
            moves.push(new Move(this.cell, new Cell(newRow, newCol)))
        }
        newRow = this.cell.row + 1 * this.colour
        newCol = this.cell.col - 1 * this.colour
        if (!board.isOutSide(newRow, newCol) && !board.isEmpty(newRow, newCol) && board.getPiece(newRow, newCol).colour !== this.colour) {
            moves.push(new Move(this.cell, new Cell(newRow, newCol)))
        }
        return moves
    }
}

export default Pawn