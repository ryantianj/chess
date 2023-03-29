import Piece from "../Piece"
import imageWhite from "../../images/wk.png"
import imageBlack from "../../images/bk.png"
import Move from "../Move"
import Cell from "../Cell";
class King extends Piece {
    #directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
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
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
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
        console.log(board.kingHasMoved(this.colour), board.rookHasMoved(this.colour, 0), board.rookHasMoved(this.colour, 7))
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

        board[newRow][newCol] = this
        board[move.oldCell.row][move.oldCell.col] = null
        this.cell = new Cell(newRow, newCol)
        this.moves.push(move)

        return {row: newRow, col: newCol}

    }
}

export default King