class Move {
    oldCell
    newCell

    constructor(oldCell, newCell, piece, isEnPassant = false, castle = {isCastle: false}, ate = null) {
        this.oldCell = oldCell
        this.newCell = newCell
        this.piece = piece
        this.isEnPassant = isEnPassant
        this.castle = castle
        this.ate = ate
    }

}
export default Move