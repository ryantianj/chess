import Piece from "../Piece"
import imageWhite from "../../images/wn.png"
import imageBlack from "../../images/bn.png"
import Move from "../Move"
import Cell from "../Cell";
class Knight extends Piece {
    #directions = [[1, 2], [1, -2], [2, 1], [2, -1], [-1, 2], [-1, -2], [-2, 1], [-2, -1]]

    points = 3
    constructor(colour, cell, moves) {
        super(colour, cell, moves)
        if (colour === Piece.WHITE) {
            this.image = imageWhite
        } else {
            this.image = imageBlack
        }
    }

    /**
     * Returns valid moves of a piece (move object)
     * @param board chess board, object
     */
    getMoves = (board) => {
        const moves = []
        for (const direction of this.#directions) {
            const row = direction[0]
            const col = direction[1]
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const newRow = row + currentRow
            const newCol = col + currentCol
            if (board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }
        }
        return moves
    }
    getAttack = (board) => {
        const moves = []
        for (const direction of this.#directions) {
            const row = direction[0]
            const col = direction[1]
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const newRow = row + currentRow
            const newCol = col + currentCol
            if (board.canEatDefend(newRow, newCol) || board.canMove(newRow, newCol)) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
            }
        }
        return moves
    }
    /**
     * Moves the piece, updates the board object as well
     */
    movePiece = (move, boardObject) => {
        const board = boardObject.getBoard()
        const newRow = move.newCell.row
        const newCol = move.newCell.col
        const oldPiece = board[newRow][newCol]
        if (oldPiece !== null) {
            move.ate = oldPiece
        }
        board[newRow][newCol] = this
        board[move.oldCell.row][move.oldCell.col] = null
        this.cell = new Cell(newRow, newCol)
        this.moves.push(move)

        return {row: newRow, col: newCol}

    }
}

export default Knight