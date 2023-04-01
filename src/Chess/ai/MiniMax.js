import Piece from "../logic/Piece";
let nodes = 0
const ab =  async (game) => {
    nodes = 0
    // const start = performance.now()
    const result =  await miniMax([], 3, -Number.MAX_VALUE, Number.MAX_VALUE, Piece.BLACK, Piece.BLACK)
    // const end = performance.now()
    // console.log(nodes, end - start, result)
    return result[0] // should be a move
}

const evaluate = (board, colour) => {
    return board.getScore(colour)
}

const switchColour = (colour) => {
    return colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
}

const miniMax = (board, depth, alpha, beta, isMax, maxPlayer, currentPlayer) => {
    nodes+=1
    if (depth === 0) {
        return [null, evaluate(board, maxPlayer)]
    }
    const testGameOver = board.isGameOver(currentPlayer).isGameOver
    if (testGameOver && currentPlayer === maxPlayer) {
        return [null, -Number.MAX_VALUE]
    }
    if (testGameOver && currentPlayer !== maxPlayer) {
        return [null, Number.MAX_VALUE]
    }
    const moves = board.getAllMoves(currentPlayer)
    const randomIndex = Math.floor(Math.random() * (moves.length - 1))
    let bestMove = moves.length > 0 ? moves[randomIndex] : null

    if (isMax){
        let maxEval = -Number.MAX_VALUE
        for (const move of moves) {
            board.movePiece(move.piece, move)
            const currentEval = miniMax(board, depth - 1, alpha, beta, false, maxPlayer, switchColour(currentPlayer))[1]
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
        let minEval = Number.MAX_VALUE
        for (const move of moves) {
            board.movePiece(move.piece, move)
            const currentEval = miniMax(board, depth - 1, alpha, beta, true, maxPlayer, switchColour(currentPlayer))[1]
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