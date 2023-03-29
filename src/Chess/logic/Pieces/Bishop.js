import Piece from "../Piece"
import imageWhite from "../../images/wb.png"
import imageBlack from "../../images/bb.png"
import Move from "../Move"
import Cell from "../Cell";
class Bishop extends Piece {
    #directions = [[1,1], [-1,-1], [1,-1],[-1,1]]
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
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const row = direction[0]
            const col = direction[1]
            let newRow = row + currentRow
            let newCol = col + currentCol
            while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
                if (board.canEat(newRow, newCol, this.colour)) {
                    break
                }
                newRow +=row
                newCol +=col
            }
        }
        return moves
    }
    getAttack = (board) => {
        const moves = []
        for (const direction of this.#directions) {
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const row = direction[0]
            const col = direction[1]
            let newRow = row + currentRow
            let newCol = col + currentCol
            while (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
                if (board.canEatDefend(newRow, newCol)) {
                    break
                }
                newRow +=row
                newCol +=col
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

        board[newRow][newCol] = this
        board[move.oldCell.row][move.oldCell.col] = null
        this.cell = new Cell(newRow, newCol)
        this.moves.push(move)

        return {row: newRow, col: newCol}

    }
}

export default Bishop