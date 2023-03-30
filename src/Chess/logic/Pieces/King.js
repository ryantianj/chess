import Piece from "../Piece"
import imageWhite from "../../images/wk.png"
import imageBlack from "../../images/bk.png"
import Move from "../Move"
import Cell from "../Cell";
class King extends Piece {
    #directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
    static KING_SIDE = 'king'
    static QUEEN_SIDE = 'queen'
    points = 0
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
        const attacked = board.getAttackingSquares(this.colour)
        for (const direction of this.#directions) {
            const row = direction[0]
            const col = direction[1]
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const newRow = row + currentRow
            const newCol = col + currentCol
            if (((board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol))) && board.canKingMove(newRow, newCol, this.colour)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }
        }

        const filterAttacked = moves.filter(move => { // king cannot move to squares under attack by enemy / pieces that are defended
            for (const attack of attacked) {
                if (move.newCell.row === attack.newCell.row && move.newCell.col === attack.newCell.col) {
                    return false
                }
            }
            return true
        })
        // castling move: if king has not moved + rook on respective square has not moved done
        // + squares in between and king not attacked  + squares in between are empty
        if (board.canCastle(this.colour, King.KING_SIDE, attacked)) {
            const row = this.colour === Piece.BLACK ? 0 : 7
            const col = 6
            filterAttacked.push(new Move(this.cell, new Cell(row, col), this, false,
                {isCastle: true, rook: new Move(new Cell(row, 7), new Cell(row, 5), board.getPiece(row, 7))}))
        }
        if (board.canCastle(this.colour, King.QUEEN_SIDE, attacked)) {
            const row = this.colour === Piece.BLACK ? 0 : 7
            const col = 2
            filterAttacked.push(new Move(this.cell, new Cell(row, col), this, false,
                {isCastle: true, rook: new Move(new Cell(row, 0), new Cell(row, 3), board.getPiece(row, 0))}))
        }
        return filterAttacked
    }
    getAttack = (board) => {
        return this.getMoves(board)
    }
    /**
     * Moves the piece, updates the board object as well
     */
    movePiece = (move, boardObject) => {
        const board = boardObject.getBoard()
        const newRow = move.newCell.row
        const newCol = move.newCell.col
        if (move.castle.isCastle) {
            board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = move.castle.rook.piece
            board[move.castle.rook.oldCell.row][move.castle.rook.oldCell.col] = null
            move.castle.rook.piece.cell.row = move.castle.rook.newCell.row
            move.castle.rook.piece.cell.col = move.castle.rook.newCell.col
        }
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

export default King