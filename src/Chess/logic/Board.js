import Pawn from "./Pieces/Pawn";
import Piece from "./Piece"
import Cell from "./Cell";
import Rook from "./Pieces/Rook";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import knight from "./Pieces/Knight";
import Knight from "./Pieces/Knight";

const testCase = [
    [new Rook(Piece.WHITE, new Cell(0,0)), new Bishop(Piece.BLACK, new Cell(0, 1)), null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, new Queen(Piece.BLACK, new Cell(2,3)), null, new King(Piece.BLACK, new Cell(2,5)), null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, new Pawn(Piece.WHITE, new Cell(4,4)), null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, new Rook(Piece.WHITE, new Cell(6,4)), null, null, null],
    [null, null, null, null, new Rook(Piece.WHITE, new Cell(7,4)), null, null, new King(Piece.WHITE, new Cell(7,7))]
]

const drawCase = [
    [null, null, null, null, null, null, null, null],
    [new Pawn(Piece.WHITE, new Cell(1,0)), new Pawn(Piece.BLACK, new Cell(1,1)),  new Pawn(Piece.BLACK, new Cell(1,2)), null, null, null,  new Pawn(Piece.BLACK, new Cell(1,6)), null],
    [ new Pawn(Piece.BLACK, new Cell(2,0)), null, null, null, null, null,  new Pawn(Piece.BLACK, new Cell(2,6)), null],
    [null, null, null, new Rook(Piece.WHITE, new Cell(3,3)), null, null, null, null],
    [null, null, null, null, null, new King(Piece.BLACK, new Cell(4,5)), null, null],
    [new Pawn(Piece.WHITE, new Cell(5,0)), null, null, new Queen(Piece.WHITE, new Cell(5,3)), null, null, null, new Pawn(Piece.WHITE, new Cell(5,7))],
    [null, null, null, null, null, null, new Pawn(Piece.WHITE, new Cell(6,6)), null],
    [null, null, null, null, null, null, null, new King(Piece.WHITE, new Cell(7,7))],
]

const hardCase = [ // rook a6
    [new Rook(Piece.WHITE, new Cell(0,0)), new Rook(Piece.BLACK, new Cell(0,1)), null, null, null, null, null, null],
    [null, null, null, null, null, new King(Piece.BLACK, new Cell(1,5)), new Pawn(Piece.BLACK, new Cell(1,6)), null],
    [null, new Queen(Piece.BLACK, new Cell(2,1)), new Queen(Piece.WHITE, new Cell(2,2)), new Bishop(Piece.BLACK, new Cell(2,3)), null, new Pawn(Piece.BLACK, new Cell(2,5)), null, new Pawn(Piece.BLACK, new Cell(2,7))],
    [null, new Pawn(Piece.BLACK, new Cell(3,1)), null, new Pawn(Piece.WHITE, new Cell(3,3)), new Pawn(Piece.BLACK, new Cell(3,4)), new Pawn(Piece.BLACK, new Cell(3,5)), null, null],
    [null, new Pawn(Piece.WHITE, new Cell(4,1)), new Pawn(Piece.BLACK, new Cell(4,2)), null, new Bishop(Piece.WHITE, new Cell(4,4)), null, null, null],
    [null, null, new Pawn(Piece.WHITE, new Cell(5,2)), null, null, null, null, new Pawn(Piece.WHITE, new Cell(5,7))],
    [null, null, null, null, null, null, new Pawn(Piece.WHITE, new Cell(6,6)), null],
    [null, null, null, null, null, new King(Piece.WHITE, new Cell(7,5)), null, null],
]

const m1 = [
    [null, null, null, new King(Piece.BLACK, new Cell(0,3)), null, null, null, null],
    [new Pawn(Piece.WHITE, new Cell(1, 0)), null, null, null, null, null, null, new Rook(Piece.WHITE, new Cell(1,7))],
    [new Queen(Piece.WHITE, new Cell(2,0)), null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
]

const castle = [
    [new Rook(Piece.BLACK, new Cell(0,0)), new knight(Piece.BLACK, new Cell(0, 1)), new Bishop(Piece.BLACK, new Cell(0, 2)), new Queen(Piece.BLACK, new Cell(0, 3)), new King(Piece.BLACK, new Cell(0, 4)), null, null, new Rook(Piece.BLACK, new Cell(0,7))],
    [new Pawn(Piece.BLACK, new Cell(1, 0)), new Pawn(Piece.BLACK, new Cell(1, 1)), new Pawn(Piece.BLACK, new Cell(1, 2)), new Pawn(Piece.BLACK, new Cell(1, 3)), new Pawn(Piece.BLACK, new Cell(1, 4)), new Pawn(Piece.BLACK, new Cell(1, 5)), new Pawn(Piece.BLACK, new Cell(1, 6)), new Pawn(Piece.BLACK, new Cell(1, 7))],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pawn(Piece.WHITE, new Cell(6, 0)), new Pawn(Piece.WHITE, new Cell(6, 1)), new Pawn(Piece.WHITE, new Cell(6, 2)), new Pawn(Piece.WHITE, new Cell(6, 3)), new Pawn(Piece.WHITE, new Cell(6, 4)), new Pawn(Piece.WHITE, new Cell(6, 5)), new Pawn(Piece.WHITE, new Cell(6, 6)), new Pawn(Piece.WHITE, new Cell(6, 7))],
    [new Rook(Piece.WHITE, new Cell(7,0)), new knight(Piece.WHITE, new Cell(7, 1)), new Bishop(Piece.WHITE, new Cell(7, 2)), new Queen(Piece.WHITE, new Cell(7, 3)), new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
]

/**
 * This class represents a chess board
 */
class Board {
    #board;

    constructor() {
        this.#board = this.newBoard()
        this.moves = []
        this.testMoves = []
    }

    /**
     * Returns a new chess board with pieces in their starting positions
     */
    newBoard = () => {
        const org = [
            [new Rook(Piece.BLACK, new Cell(0,0)), new knight(Piece.BLACK, new Cell(0, 1)), new Bishop(Piece.BLACK, new Cell(0, 2)), new Queen(Piece.BLACK, new Cell(0, 3)), new King(Piece.BLACK, new Cell(0, 4)), new Bishop(Piece.BLACK, new Cell(0, 5)), new knight(Piece.BLACK, new Cell(0, 6)), new Rook(Piece.BLACK, new Cell(0,7))],
            [new Pawn(Piece.BLACK, new Cell(1, 0)), new Pawn(Piece.BLACK, new Cell(1, 1)), new Pawn(Piece.BLACK, new Cell(1, 2)), new Pawn(Piece.BLACK, new Cell(1, 3)), new Pawn(Piece.BLACK, new Cell(1, 4)), new Pawn(Piece.BLACK, new Cell(1, 5)), new Pawn(Piece.BLACK, new Cell(1, 6)), new Pawn(Piece.BLACK, new Cell(1, 7))],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn(Piece.WHITE, new Cell(6, 0)), new Pawn(Piece.WHITE, new Cell(6, 1)), new Pawn(Piece.WHITE, new Cell(6, 2)), new Pawn(Piece.WHITE, new Cell(6, 3)), new Pawn(Piece.WHITE, new Cell(6, 4)), new Pawn(Piece.WHITE, new Cell(6, 5)), new Pawn(Piece.WHITE, new Cell(6, 6)), new Pawn(Piece.WHITE, new Cell(6, 7))],
            [new Rook(Piece.WHITE, new Cell(7,0)), new knight(Piece.WHITE, new Cell(7, 1)), new Bishop(Piece.WHITE, new Cell(7, 2)), new Queen(Piece.WHITE, new Cell(7, 3)), new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
        ]
        const startingBoard = org
        return startingBoard
    }

    clonePiece = (piece) => {
        if (piece instanceof Pawn) {
            return new Pawn(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        } else if (piece instanceof Bishop) {
            return new Bishop(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        } else if (piece instanceof King) {
            return new King(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        } else if (piece instanceof Knight) {
            return new Knight(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        } else if (piece instanceof Queen) {
            return new Queen(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        } else if (piece instanceof Rook) {
            return new Rook(piece.colour, new Cell(piece.cell.row, piece.cell.col))
        }
        return null
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

    /**
     * Returns if the cell is outside the chess board
     */
    isOutSide = (row, col) => {
        return row < 0 || col < 0 || row > 7 || col > 7
    }

    /**
     * Returns if the pieces at cell can be eaten
     */
    canEat = (row, col, colour) => {
        return !this.isOutSide(row, col) && !this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour
    }

    /**
     * Returns if the piece at cell is defended or can be eaten
     */
    canEatDefend = (row, col) => {
        return !this.isOutSide(row, col) && !this.isEmpty(row, col)
    }

    /**
     * Returns if the cell can be moved to
     */
    canMove = (row, col) => {
        return !this.isOutSide(row, col) && this.isEmpty(row, col)
    }

    /**
     * Returns if King can move to a cell
     */
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

    /**
     * Moves a piece
     */

    movePiece = (piece, move) => {
        const result =  this.getPiece(piece.cell.row, piece.cell.col).movePiece(move, this)
        move.isCheck = this.isCheck(move.piece.colour * -1)
        move.boardString = this.getFullString()
        this.moves.push(move)
        return result
    }

    /**
     * Moves a piece, to be undone later (for generating legal moves)
     */
    testMovePiece = (piece, move) => {
        const result =  this.getPiece(piece.cell.row, piece.cell.col).movePiece(move, this)
        this.testMoves.push(move)
        return result
    }

    /**
     * Undo a move (for generating legal moves)
     */
    testUndoMove = () => {
        if (this.testMoves.length > 0) {
            const move = this.testMoves.pop()
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
                move.castle.rook.piece.cell.row = move.castle.rook.oldCell.row
                move.castle.rook.piece.cell.col = move.castle.rook.oldCell.col
                this.#board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = null
            }
            this.#board[move.newCell.row][move.newCell.col] = move.ate
            return true
        }
        return false
    }

    /**
     * Undo a move (on the chess board)
     */
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
                move.castle.rook.piece.cell.row = move.castle.rook.oldCell.row
                move.castle.rook.piece.cell.col = move.castle.rook.oldCell.col
                this.#board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = null
            }
            this.#board[move.newCell.row][move.newCell.col] = move.ate
            return true
        }
        return false
    }

    /**
     * Check if king has moved, for castling purposes
     */
    kingHasMoved = (colour) => {
        for (const move of this.moves) {
            if (move.piece instanceof King && move.piece.colour === colour) {
                return true
            }
        }
        return false
    }

    /**
     * Check if rook has moved, for castling purposes
     */
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

    /**
     * Check if squares between rook and king are empty, for castling purposes
     */
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

    /**
     * Check if squares between rook and king are under attack, for castling purposes
     */
    castlingSquaresUnderAttack = (colour, side, attacked) => { // includes the king himself
        const row = colour === Piece.BLACK ? 0 : 7
        const cols = side === King.KING_SIDE ? [4,5,6] : [2,3,4]
        for (const col of cols) {
            for (const move of attacked) {
                if (move.newCell.row === row && move.newCell.col === col) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Check if king can castle
     */
    canCastle = (colour, side, attacked) => {
        // console.log(this.castlingSquaresIsEmpty(colour, side) , !this.castlingSquaresUnderAttack(colour, side, attacked)
        //     , !this.rookHasMoved(colour, side) , !this.kingHasMoved(colour))
        return this.castlingSquaresIsEmpty(colour, side) && !this.castlingSquaresUnderAttack(colour, side, attacked)
        && !this.rookHasMoved(colour, side) && !this.kingHasMoved(colour)
    }

    /**
     * Promotes a pawn to the selected piece
     */
    promotePiece = (piece) => {
        const row = piece.cell.row
        const col = piece.cell.col
        this.#board[row][col] = piece
        this.moves[this.moves.length - 1].promotionPiece = piece
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
        this.testMovePiece(piece, move)
        if (this.isCheck(piece.colour)) {
            this.testUndoMove()
            return true
        }
        this.testUndoMove()
        return false
    }

    /**
     * Defined by: same position occurs thrice for threefold repetition
     * @param times
     * @return {boolean}
     */
    isRepeatPosition = () => {
        if (this.moves.length < 6) {
            return false
        }
        const latestMove = this.moves.slice(-1)[0]
        const latestPosition = latestMove.boardString
        let positionCount = 0
        for (const move of this.moves) {
            if (move.boardString === latestPosition) {
                positionCount++
            }
        }

        return positionCount >= 3
    }

    /**
     * Checks if game is over for colour, means other colour wins, check is done AFTER a legal move
     * @param colour
     * @return {{isGameOver: boolean, message: string}}
     */
    isGameOver = (colour) => {
        const allMoves = this.getAllMoves(colour)
        const underCheck = this.isCheck(colour)
        const player = colour === Piece.BLACK ? "White" : "Black"
        if (underCheck && allMoves.length <= 0) {
            return {isGameOver: true, message: player + " wins by checkmate"}
        } else if (!underCheck && allMoves.length <= 0) {
            return {isGameOver: true, message: "Draw by stalemate"}
        } else if (this.isRepeatPosition()) {
            return {isGameOver: true, message: "Draw by threefold repetition"}
        }
        return {isGameOver: false, message: ""}
    }

    /**
     * Gets all moves on the board
     */
    getAllMoves = (colour) => {
        let squares = []
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (!this.isEmpty(row, col) && this.getPiece(row, col).colour === colour) {
                    const piece = this.getPiece(row, col)
                    const moves = piece.getMoves(this)
                    squares = squares.concat(moves)
                }
            }
        }
        return squares
    }

    /**
     * Get string representation of the board
     */
    getBoardString = () => {
        const newBoard = []
        for (let row = 0; row < 8; row++) {
            const newRow = []
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col)
                if (piece !== null) {
                    if (piece instanceof Pawn && (row === 0 || row === 7)) {
                        newRow.push(new Queen(piece.colour, piece.cell).getString())
                    } else {
                        newRow.push(piece.getString())
                    }
                } else {
                    newRow.push(null)
                }
            }
            newBoard.push(newRow)
        }
        return newBoard
    }

    /**
     * get string representation of the board, more condensed than getBoardString, for threefold repetition
     */
    getFullString = () => {
        let newBoard = ""
        for (let row = 0; row < 8; row++) {
            let newRow = ""
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col)
                if (piece !== null) {
                    newRow += piece.getString()
                } else {
                    newRow+= " "
                }
            }
            newBoard += newRow
        }
        return newBoard
    }

}
export default Board