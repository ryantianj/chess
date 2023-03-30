import Pawn from "./Pieces/Pawn";
import Piece from "./Piece"
import Cell from "./Cell";
import Rook from "./Pieces/Rook";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import knight from "./Pieces/Knight";


class Board {
    #board;

    constructor() {
        this.#board = this.newBoard()
        this.moves = []
    }

    newBoard = () => {
        const startingBoard = [
            [new Rook(Piece.BLACK, new Cell(0,0)), new knight(Piece.BLACK, new Cell(0, 1)), new Bishop(Piece.BLACK, new Cell(0, 2)), new Queen(Piece.BLACK, new Cell(0, 3)), new King(Piece.BLACK, new Cell(0, 4)), new Bishop(Piece.BLACK, new Cell(0, 5)), new knight(Piece.BLACK, new Cell(0, 6)), new Rook(Piece.BLACK, new Cell(0,7))],
            [new Pawn(Piece.BLACK, new Cell(1, 0), []), new Pawn(Piece.BLACK, new Cell(1, 1), []), new Pawn(Piece.BLACK, new Cell(1, 2), []), new Pawn(Piece.BLACK, new Cell(1, 3), []), new Pawn(Piece.BLACK, new Cell(1, 4), []), new Pawn(Piece.BLACK, new Cell(1, 5), []), new Pawn(Piece.BLACK, new Cell(1, 6), []), new Pawn(Piece.BLACK, new Cell(1, 7), [])],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn(Piece.WHITE, new Cell(6, 0)), new Pawn(Piece.WHITE, new Cell(6, 1)), new Pawn(Piece.WHITE, new Cell(6, 2), []), new Pawn(Piece.WHITE, new Cell(6, 3), []), new Pawn(Piece.WHITE, new Cell(6, 4), []), new Pawn(Piece.WHITE, new Cell(6, 5), []), new Pawn(Piece.WHITE, new Cell(6, 6), []), new Pawn(Piece.WHITE, new Cell(6, 7), [])],
            [new Rook(Piece.WHITE, new Cell(7,0)), new knight(Piece.WHITE, new Cell(7, 1)), new Bishop(Piece.WHITE, new Cell(7, 2)), new Queen(Piece.WHITE, new Cell(7, 3)), new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
        ]
        return startingBoard
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
    /**
     * Returns the squares, marked by moves, that are under attack by the opposing colour
     * @param colour
     * @return {*[]}
     */
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

    undoMove = () => {
        if (this.moves.length > 0) {
            const move = this.moves.pop()
            const prevRow = move.oldCell.row
            const prevCol = move.oldCell.col
            const piece = this.#board[move.newCell.row][move.newCell.col]
            this.#board[prevRow][prevCol] = piece
            piece.moves.pop()
            piece.cell.row = prevRow
            piece.cell.col = prevCol
            if (move.isEnPassant) { // add back pawn
                this.#board[move.ate.cell.row][move.ate.cell.col] = move.ate
                this.#board[move.newCell.row][move.newCell.col] = null
                return true
            }
            if (move.isPromotion) { // remove piece, add back pawn
                this.#board[prevRow][prevCol] = new Pawn(piece.colour, piece.cell, piece.moves)
            }
            if (move.castle.isCastle) { // king will be undone, need to undo rook
                this.#board[move.castle.rook.oldCell.row][move.castle.rook.oldCell.col] = move.castle.rook.piece
                this.#board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = null
            }
            this.#board[move.newCell.row][move.newCell.col] = move.ate
            return true
        }
        return false
    }

    kingHasMoved = (colour) => {
        for (const move of this.moves) {
            if (move.piece instanceof King && move.piece.colour === colour) {
                return true
            }
        }
        return false
    }

    rookHasMoved = (colour, side) => {
        const row = colour === Piece.BLACK ? 0 : 7
        const col = side === King.KING_SIDE ? 7 : 0
        if (!(this.getPiece(row, col) instanceof Rook)) { // no rook on cell
            return true
        }
        for (const move of this.moves) {
            if (move.piece instanceof Rook && move.piece.colour === colour && move.oldCell.row === row && move.oldCell.col === col) {
                return true
            }
        }
        return false
    }

    castlingSquaresIsEmpty = (colour, side) => {
        const row = colour === Piece.BLACK ? 0 : 7
        const cols = side === King.KING_SIDE ? [5,6] : [1,2,3]
        for (const col of cols) {
            if (!this.isEmpty(row, col)) {
                return false
            }
        }
        return true
    }
    castlingSquaresUnderAttack = (colour, side, attacked) => { // includes the king himself
        const row = colour === Piece.BLACK ? 0 : 7
        const cols = side === King.KING_SIDE ? [4,5,6] : [1,2,3,4]
        for (const col of cols) {
            for (const move of attacked) {
                if (move.newCell.row === row && move.newCell.col === col) {
                    return true
                }
            }
        }
        return false
    }

    canCastle = (colour, side, attacked) => {
        // console.log(this.castlingSquaresIsEmpty(colour, side) , !this.castlingSquaresUnderAttack(colour, side, attacked)
        //     , !this.rookHasMoved(colour, side) , !this.kingHasMoved(colour))
        return this.castlingSquaresIsEmpty(colour, side) && !this.castlingSquaresUnderAttack(colour, side, attacked)
        && !this.rookHasMoved(colour, side) && !this.kingHasMoved(colour)
    }

    promotePiece = (piece) => {
        const row = piece.cell.row
        const col = piece.cell.col
        this.#board[row][col] = piece
    }

    // returns if colour is under check
    isCheck = (colour) => {
        const attacked = this.getAttackingSquares(colour)
        for (const move of attacked) {
            if (this.getPiece(move.newCell.row, move.newCell.col) instanceof King
                && this.getPiece(move.newCell.row, move.newCell.col).colour === colour) {
                return true
            }
        }
        return false
    }

    /**
     * This functions determines if a move will result in your own King being under check (illegal move)
     * @param piece
     * @param move
     */
    willCheck = (piece, move) => {
        this.movePiece(piece, move)
        if (this.isCheck(piece.colour)) {
            this.undoMove()
            return true
        }
        this.undoMove()
        return false
    }
    getAllMoves = (colour) => {
        let moves = []
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.#board[row][col]
                if (piece !== null && this.getPiece(row, col).colour === colour) {
                    moves = moves.concat(this.getPiece(row, col).getMoves(this))
                }
            }
        }
        return moves
    }

    isGameOver = (colour) => {
        return this.isCheck(colour) && this.getAllMoves(colour).length <= 0
    }

}
export default Board