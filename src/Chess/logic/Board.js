import Pawn from "./Pieces/Pawn";
import Piece from "./Piece"
import Cell from "./Cell";

class Board {
    #board;

    constructor() {
        this.#board = this.#newBoard()
    }

    #newBoard = () => {
        return [
            [null, null, null, null, null, null, null, null],
            [new Pawn(Piece.BLACK, new Cell(1, 0), []), new Pawn(Piece.BLACK, new Cell(1, 1), []), new Pawn(Piece.BLACK, new Cell(1, 2), []), new Pawn(Piece.BLACK, new Cell(1, 3), []), new Pawn(Piece.BLACK, new Cell(1, 4), []), new Pawn(Piece.BLACK, new Cell(1, 5), []), new Pawn(Piece.BLACK, new Cell(1, 6), []), new Pawn(Piece.BLACK, new Cell(1, 7), [])],
            [null, new Pawn(Piece.WHITE, new Cell(2, 1), []), null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn(Piece.WHITE, new Cell(6, 0), []), new Pawn(Piece.WHITE, new Cell(6, 1), []), new Pawn(Piece.WHITE, new Cell(6, 2), []), new Pawn(Piece.WHITE, new Cell(6, 3), []), new Pawn(Piece.WHITE, new Cell(6, 4), []), new Pawn(Piece.WHITE, new Cell(6, 5), []), new Pawn(Piece.WHITE, new Cell(6, 6), []), new Pawn(Piece.WHITE, new Cell(6, 7), [])],
            [null, null, null, null, null, null, null, null],
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

    movePiece = (row, col, piece, move) => {
        this.#board[row][col] = piece
        this.#board[piece.cell.row][piece.cell.col] = null
        piece.cell = new Cell(row, col)
        piece.moves.push(move)
        console.log(piece)
    }

}
export default Board