import Piece from "../Piece"
import imageWhite from "../../images/wr.png"
import imageBlack from "../../images/br.png"
import Move from "../Move"
import Cell from "../Cell";
class Rook extends Piece {
    #directions = [[0,1], [1,0], [0,-1],[-1,0]]
    points = 5
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
                const move = new Move(this.cell, new Cell(newRow, newCol), this)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
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
                const move = new Move(this.cell, new Cell(newRow, newCol), this)
                moves.push(move)
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

    getString = () => {
        const colourString = this.colour === Piece.WHITE ? "w" : "b"
        return colourString + "r"
    }
}

export default Rook