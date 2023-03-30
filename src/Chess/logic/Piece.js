class Piece {
    static WHITE = -1
    static BLACK = 1
    isAlive = true
    constructor(colour, cell, moves= []) {
        this.colour = colour // white or black
        this.cell = cell
        this.moves = moves // moves made by the piece so far, [[startRow, startCol, endRow, endCol]], most recent at the back (can pop())
    }
    // each piece should have methods:
    // getMoves(board, prevMoves: array of pieces moved so far(for castling)) returns array of coordinates of valid moves


    // special
    // en passant: use moves done
    // castling: use moves + need check if pieces are under attack done
    // promotion: row, col done
    // pieces that can move under check
    // for each piece move, calculate if its legal (king will not be under check) done
    // if move is executed, king should not be under check
    // TODO: is game over: king under check + no piece of that colour can move
}
export default Piece