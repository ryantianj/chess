import Board from "./Board";
import Player from "./Player";
import Piece from "./Piece";

class Game {
    // game has a board, game has players, game has turns, game has time
    turnColour = Piece.WHITE
    constructor() {
        this.board = new Board()
        this.players = [new Player(Piece.WHITE), new Player(Piece.BLACK)]
    }

    movePiece = (piece, move) => {
        this.turnColour = this.turnColour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
        return this.board.movePiece(piece, move)
    }

}
export default Game