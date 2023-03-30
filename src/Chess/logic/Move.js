class Move {
    oldCell
    newCell

    constructor(oldCell, newCell, piece, isEnPassant = false,
                castle = {isCastle: false}, ate = null, isPromotion = false) {
        this.oldCell = oldCell
        this.newCell = newCell
        this.piece = piece
        this.isEnPassant = isEnPassant
        this.castle = castle
        this.ate = ate
        this.isPromotion = isPromotion
    }

}
export default Move