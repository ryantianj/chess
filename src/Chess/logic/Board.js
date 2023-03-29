import Pawn from "./Pieces/Pawn";
import Piece from "./Piece"
import Cell from "./Cell";
import Knight from "./Pieces/Knight";
import Rook from "./Pieces/Rook";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import knight from "./Pieces/Knight";

const startingBoard = [
    [new Rook(Piece.BLACK, new Cell(0,0)), new knight(Piece.BLACK, new Cell(0, 1)), new Bishop(Piece.BLACK, new Cell(0, 2)), new Queen(Piece.BLACK, new Cell(0, 3)), new King(Piece.BLACK, new Cell(0, 4)), new Bishop(Piece.BLACK, new Cell(0, 5)), new knight(Piece.BLACK, new Cell(0, 6)), new Rook(Piece.BLACK, new Cell(0,7))],
    [new Pawn(Piece.BLACK, new Cell(1, 0), []), new Pawn(Piece.BLACK, new Cell(1, 1), []), new Pawn(Piece.BLACK, new Cell(1, 2), []), new Pawn(Piece.BLACK, new Cell(1, 3), []), new Pawn(Piece.BLACK, new Cell(1, 4), []), new Pawn(Piece.BLACK, new Cell(1, 5), []), new Pawn(Piece.BLACK, new Cell(1, 6), []), new Pawn(Piece.BLACK, new Cell(1, 7), [])],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pawn(Piece.WHITE, new Cell(6, 0), []), new Pawn(Piece.WHITE, new Cell(6, 1), []), new Pawn(Piece.WHITE, new Cell(6, 2), []), new Pawn(Piece.WHITE, new Cell(6, 3), []), new Pawn(Piece.WHITE, new Cell(6, 4), []), new Pawn(Piece.WHITE, new Cell(6, 5), []), new Pawn(Piece.WHITE, new Cell(6, 6), []), new Pawn(Piece.WHITE, new Cell(6, 7), [])],
    [new Rook(Piece.WHITE, new Cell(7,0)), new knight(Piece.WHITE, new Cell(7, 1)), new Bishop(Piece.WHITE, new Cell(7, 2)), new Queen(Piece.WHITE, new Cell(7, 3)), new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
]
class Board {
    #board;

    constructor() {
        this.#board = this.#newBoard()
        this.moves = []
    }

    #newBoard = () => {
        return [
            [null, null, null, null, new King(Piece.BLACK, new Cell(0, 4)), new Bishop(Piece.BLACK, new Cell(0, 5)), new knight(Piece.BLACK, new Cell(0, 6)), new Rook(Piece.BLACK, new Cell(0,7))],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
        ]
    }

    /**
     * Returns the board represented by the array
     */
    getBoard = () => {
        return this.#board
    }
    /**
     * Returns piece at the coordinates
     */
    getPiece = (row, col) => {
        return this.#board[row][col]
    }

    /**
     * Returns if the cell is empty
     */
    isEmpty = (row, col) => {
        if (this.isOutSide(row, col)) {
            return false
        }
        return this.#board[row][col] === null
    }
    isUnderCheck = (colour) => {
        return false
    }
    isOutSide = (row, col) => {
        return row < 0 || col < 0 || row > 7 || col > 7
    }

    canEat = (row, col, colour) => {
        return !this.isOutSide(row, col) && !this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour
    }

    canEatDefend = (row, col) => {
        return !this.isOutSide(row, col) && !this.isEmpty(row, col)
    }

    canMove = (row, col) => {
        return !this.isOutSide(row, col) && this.isEmpty(row, col)
    }

    canKingMove = (row, col, colour) => {
        const directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
        for (const direction of directions) {
            const newRow = row + direction[0]
            const newCol = col + direction[1]
            if (!this.isOutSide(newRow, newCol) && !this.isEmpty(newRow, newCol)
                && (this.getPiece(newRow, newCol) instanceof King && this.getPiece(newRow, newCol).colour !== colour)) {
                return false
            }
        }
        return true
    }

    getAttackingSquares = (colour) => { // colour is for piece being attacked
        let squares = []
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (!this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour && !(this.getPiece(row, col) instanceof King)) {
                    const piece = this.getPiece(row, col)
                    const moves = piece.getAttack(this)
                    squares = squares.concat(moves)
                }
            }
        }
        return squares
    }

    movePiece = (piece, move) => {
        const result =  this.#board[piece.cell.row][piece.cell.col].movePiece(move, this)
        this.moves.push(move)
        return result
    }

    kingHasMoved = (colour) => {
        for (const move of this.moves) {
            if (move.piece instanceof King && move.piece.colour === colour) {
                return true
            }
        }
        return false
    }

    rookHasMoved = (colour, col) => {
        const row = colour === Piece.BLACK ? 0 : 7
        if (!(this.getPiece(row, col) instanceof Rook)) { // no rook on cell
            return true
        }
        for (const move of this.moves) {
            if (move.piece instanceof Rook && move.piece.colour === colour) {
                return true
            }
        }
        return false
    }
    castlingSquaresUnderAttack = (colour, attacked) => { // includes the king himself

    }

}
export default Board