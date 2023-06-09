import Board from "./Board";
import Player from "./Player";
import Piece from "./Piece";

/**
 * This class represents a chess game
 */
class Game {
    // game has a board, game has players, game has turns, game has time
    turnColour = Piece.WHITE
    constructor() {
        this.board = new Board()
        this.players = [new Player(Piece.WHITE), new Player(Piece.BLACK)]
    }

    movePiece = (piece, move) => {
        const result =  this.board.movePiece(piece, move)
        this.turnColour = this.turnColour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
        return result
    }
    /**
     * Get pieces eaten by colour
     * @param colour
     * @return {*[]}
     */
    getEatenPieces = (colour) => {
        const moves = this.board.moves
        const filtered =  moves.filter(move => {
            return move.ate !== null && move.ate.colour !== colour
        }).map(x => x.ate)
            filtered.sort((a, b) => {
                return a.points - b.points
            })
        return filtered
    }

    undoMove = () => {
        const isUndo = this.board.undoMove()
        if (isUndo) {
            this.turnColour = this.turnColour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
        }
    }

}
export default Game