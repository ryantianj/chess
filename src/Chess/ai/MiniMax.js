import Piece from "../logic/Piece";

const ab = (game) => {
    const copyBoard = game.copyBoard()
    const result = miniMax(copyBoard, 2, -Number.MAX_VALUE, Number.MAX_VALUE, Piece.BLACK, Piece.BLACK)
    console.log(result)
    return result // should be a move
}

const evaluate = (board, colour) => {
    return board.getScore(colour)
}

const switchColour = (colour) => {
    return colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
}

const miniMax = (board, depth, alpha, beta, maxPlayer, currentPlayer) => {
    if (depth === 0 || board.isGameOver()) {
        return [null, evaluate(board, maxPlayer)]
    }
    const moves = board.getAllMoves(currentPlayer)
    const randomIndex = Math.floor(Math.random() * (moves.length - 1))
    let bestMove = moves.length > 0 ? moves[randomIndex] : null

    if (currentPlayer === maxPlayer) {
        let maxEval = -Number.MAX_VALUE
        for (const move of moves) {
            board.movePiece(move.piece, move)
            const currentEval = miniMax(board, depth - 1, alpha, beta, maxPlayer, switchColour(currentPlayer))[1]
            board.undoMove()
            if (currentEval > maxEval) {
                maxEval = currentEval
                bestMove = move
            }
            alpha = Math.max(alpha, currentEval)
            if (beta <= alpha) {
                break
            }
        }
        return [bestMove, maxEval]
    } else {
        let minEval = -Number.MAX_VALUE
        for (const move of moves) {
            board.movePiece(move.piece, move)
            const currentEval = miniMax(board, depth - 1, alpha, beta, maxPlayer, switchColour(currentPlayer))[1]
            board.undoMove()
            if (currentEval < minEval) {
                minEval = currentEval
                bestMove = move
            }
            beta = Math.max(beta, currentEval)
            if (beta <= alpha) {
                break
            }
        }
        return [bestMove, minEval]
    }
}

export default ab