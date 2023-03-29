class Move {
    oldCell
    newCell

    constructor(oldCell, newCell, piece, isEnPassant = false) {
        this.oldCell = oldCell
        this.newCell = newCell
        this.piece = piece
        this.isEnPassant = isEnPassant
    }

}
export default Move