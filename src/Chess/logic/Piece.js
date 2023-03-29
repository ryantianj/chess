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
    // castling: use moves + need check if pieces are under attack
    // promotion: row, col half done
    // pieces that can move under check
}
export default Piece