import Piece from "../Piece"
import imageWhite from "../../images/wp.png"
import imageBlack from "../../images/bp.png"
import Move from "../Move"
import Cell from "../Cell";
class Pawn extends Piece {
    points = 1
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
        let newRow = this.cell.row + 1 * this.colour
        let newCol = this.cell.col
        if (board.canMove(newRow, newCol)) {
            const move = new Move(this.cell, new Cell(newRow, newCol), this)
            if (!board.willCheck(this, move)) {
                moves.push(move)
            }
            newRow = this.cell.row + 2 * this.colour
            if (board.canMove(newRow, newCol) && this.moves.length <= 0) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }
        }
        newRow = this.cell.row + 1 * this.colour
        newCol = this.cell.col + 1
        if (board.canEat(newRow, newCol, this.colour)) {
            const move = new Move(this.cell, new Cell(newRow, newCol), this)
            if (!board.willCheck(this, move)) {
                moves.push(move)
            }
        }
        // en passant
        if (board.canMove(newRow, newCol) && board.moves.length > 0) {
            const prevMove = board.moves.slice(-1)[0]
            if (prevMove.piece instanceof Pawn && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col + 1
                && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }

        }
        newRow = this.cell.row + 1 * this.colour
        newCol = this.cell.col - 1
        if (board.canEat(newRow, newCol, this.colour)) {
            const move = new Move(this.cell, new Cell(newRow, newCol), this)
            if (!board.willCheck(this, move)) {
                moves.push(move)
            }
        }
        // en passant
        if (board.canMove(newRow, newCol) && board.moves.length > 0) {
            const prevMove = board.moves.slice(-1)[0]
            if (prevMove.piece instanceof Pawn && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col - 1
                && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }

        }
        return moves
    }
    getAttack = (board) => {
        const moves = []
        let newRow = this.cell.row + 1 * this.colour
        let newCol = this.cell.col + 1
        if (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
            moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
        }
        newRow = this.cell.row + 1 * this.colour
        newCol = this.cell.col - 1
        if (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
            moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
        }
        return moves
    }
    /**
     * Moves the piece
     */
    movePiece = (move, boardObject) => {
        const board = boardObject.getBoard()
        const newRow = move.newCell.row
        const newCol = move.newCell.col
        // const old = board[move.oldCell.row][move.oldCell.col]
        if (move.isEnPassant) {
            const prevMove = boardObject.moves.slice(-1)[0]
            const oldPiece = board[prevMove.newCell.row][prevMove.newCell.col]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[prevMove.newCell.row][prevMove.newCell.col] = null
        }
        const oldPiece = board[newRow][newCol]
        if (oldPiece !== null) {
            move.ate = oldPiece
        }
        board[newRow][newCol] = this
        board[move.oldCell.row][move.oldCell.col] = null
        this.cell = new Cell(newRow, newCol)

        // promotion
        if (newRow === 0 || newRow === 7) {
            move.isPromotion = true
            this.moves.push(move)
            return {promotion: true, row: newRow, col: newCol}
        }
        this.moves.push(move)
        return {row: newRow, col: newCol}
    }

    getString = () => {
        const colourString = this.colour === Piece.WHITE ? "w" : "b"
        return colourString + "p"
    }
}

export default Pawn