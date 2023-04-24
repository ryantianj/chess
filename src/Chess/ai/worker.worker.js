let totalMoves = 0
const test = async (message) => {
   // https://chess.stackexchange.com/questions/40362/my-transposition-tables-implementation-slows-down-alpha-beta-pruning
    // https://github.com/maksimKorzh/chess_programming/blob/master/src/negamax/tutorials/alpha-beta_quiescence_search/chess.c
    //https://stackoverflow.com/questions/29990116/alpha-beta-prunning-with-transposition-table-iterative-deepening
    // https://stackoverflow.com/questions/16500739/chess-high-branching-factor
    // https://github.com/maksimKorzh/chess_programming/blob/master/src/bbc/collecting_pv/bbc.c
    // https://github.com/kbjorklu/chess/blob/master/src/bitboard.js
    //https://chess.stackexchange.com/questions/28160/moves-per-depth-in-search-engines
    // TODO: check if endgame before running search, set score tables before search, done after set board string
    // End game defined by: either side has a queen + pawns only / either side has at most 2 minor pieces
    // TODO: update piece score tables based on position before running search, done after set board string
    // for knight, -5 per missing pawn of any colour
    // for bishop, fianchetto bonus points, control over square colour (using pawns), bishop pair bonus
    // rook penalty for trap by king, bonus for open file, bonus for each missing pawn
    // pawn, increase value +30 if past pawn (no pawns of opposing colour on the 3 cols), decrease value if doubled (-10)
    const mem = new Map() // for killer moves
    const MAX_DEPTH = 10
    let whiteCanCastle = true
    let blackCanCastle = true
    const pv_length = Array.from({length: MAX_DEPTH}, (x) => 0);
    const pv_table = Array.from({length: MAX_DEPTH}, (x) => Array.from({length: MAX_DEPTH}, (x) => 0))
    let startTime;
    const MAX_TIME = 20000 // 20 seconds
    const CHECK_THRESHOLD = 100000 // power of 2
    let nodes = 0
    let branch = 0
    const ab =  (boardString, depth, moveString, colour, pv) => {
        const copyBoard = new Board()
        copyBoard.setBoardString(boardString)
        copyBoard.moves = moveString.map(x => Move.parseMove(copyBoard, x))
        // set pv from previous iteration
        for (let i = 2; i < pv.length; i++) { // first two moves would have been made
            pv_table[0][i - 2] = Move.parseMove(copyBoard, pv[i])
        }
        const isEndGame = copyBoard.isEndGame()
        if (isEndGame) {
            console.log("endgame")
            copyBoard.setEndGame()
        }
        copyBoard.updatePieceValues(totalMoves)
        for (let i = 1; i < depth; i++) {
            mem.set(i, [null, null, null]) // max number of killer moves
        }
        startTime = performance.now()
        let result
        for (let i = 1; i <= depth; i++) { // iterative deepening
            result = miniMax(copyBoard, i, -Number.MAX_VALUE, Number.MAX_VALUE, colour, colour, mem, 0)
            console.log("Score", result[1], pv_table[0][0].newCell)
        }
        // result = miniMax(copyBoard, depth, -Number.MAX_VALUE, Number.MAX_VALUE, colour, colour, mem, 0)
        const end = performance.now()
        // console.log(end - start, totalMoves, nodes)
        const arr = []
        for (let i = 0; i < depth; i++) {
            arr.push(pv_table[0][i].getMoveString())
        }
        console.log(end - startTime, nodes, branch)
        // console.log("eval", nodes)


        return [pv_table[0][0].getMoveString(), arr] // should be a move
    }

    const miniMax = (board, depth, alpha, beta, maxPlayer, currentPlayer, mem, ply) => {
        if (nodes % CHECK_THRESHOLD === 0) {
            if (performance.now() - startTime > MAX_TIME) {
                return [pv_table[0][0], -99999]
            }
        }
        const moves = board.getAllMoves(currentPlayer) // TODO: time consuming
        moveOrderRoot(moves, depth, ply)
        let bestMove;
        if (currentPlayer === maxPlayer) {
            let maxEval = -90000
            let illegal = 0
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    board.undoMove()
                    illegal++
                    continue
                }

                if (bestMove === undefined) {
                    bestMove = move
                }
                const currentEval = miniMaxCore(board, depth - 1, alpha, beta, maxPlayer, currentPlayer * -1, moves, mem, ply + 1)
                board.undoMove()
                if (currentEval > maxEval) {
                    maxEval = currentEval
                    bestMove = move
                    pv_table[ply][ply] = move
                    for (let next_ply = ply + 1; next_ply < pv_length[ply + 1]; next_ply++) {
                        // copy move from deeper ply into a current ply's line
                        pv_table[ply][next_ply] = pv_table[ply + 1][next_ply];
                    }
                    // adjust PV length
                    pv_length[ply] = pv_length[ply + 1];
                }
                alpha = Math.max(alpha, currentEval)
                if (beta <= alpha) {
                    break
                }
            }
            if (illegal === moves.length) { // TODO: check stalemate
                if (board.isCheck(currentPlayer)) {
                    return [null, -90000]
                }
                return [null, 0]
            }
            return [bestMove, maxEval]
        } else {
            let minEval = 90000
            let illegal = 0
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    board.undoMove()
                    illegal++
                    continue
                }
                if (bestMove === undefined) {
                    bestMove = move
                }
                const currentEval = miniMaxCore(board, depth - 1, alpha, beta, maxPlayer, currentPlayer * -1, moves, mem, ply + 1)
                board.undoMove()
                if (currentEval < minEval) {
                    minEval = currentEval
                    bestMove = move
                    pv_table[ply][ply] = move
                    for (let next_ply = ply + 1; next_ply < pv_length[ply + 1]; next_ply++) {
                        // copy move from deeper ply into a current ply's line
                        pv_table[ply][next_ply] = pv_table[ply + 1][next_ply];
                    }
                    // adjust PV length
                    pv_length[ply] = pv_length[ply + 1];
                }
                beta = Math.min(beta, currentEval)
                if (beta <= alpha) {
                    break
                }
            }
            if (illegal === moves.length) {
                if (board.isCheck(currentPlayer)) {
                    return [null, 90000]
                }
                return [null, 0]

            }
            return [bestMove, minEval]
        }
    }
    const miniMaxCore = (board, depth, alpha, beta, maxPlayer, currentPlayer, prevMoves, mem, ply) => {
        if (nodes % CHECK_THRESHOLD === 0) {
            if (performance.now() - startTime > MAX_TIME) {
                return -99999
            }
        }
        let branchLocal = 0
        nodes++
        const MAX_KILLER = 2
        pv_length[ply] = ply
        if (depth === 0) {
            let result
            if (maxPlayer === currentPlayer && board.moves.slice(-1)[0].ate !== null) {
                result = quiesce(alpha, beta, board, currentPlayer, 2, prevMoves)
            } else {
                result = board.getScore(maxPlayer, prevMoves)
            }
            return result
        }
        const moves = board.getAllMoves(currentPlayer) // TODO: time consuming
        moveOrder(moves, mem, depth, ply)
        if (currentPlayer === maxPlayer) {
            let maxEval = -30000
            let illegal = 0
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    board.undoMove()
                    illegal++
                    continue
                }
                branchLocal++
                const currentEval = miniMaxCore(board, depth - 1, alpha, beta, maxPlayer, currentPlayer * -1, moves, mem, ply + 1)
                board.undoMove()
                if (currentEval > maxEval) {
                    maxEval = currentEval
                    pv_table[ply][ply] = move
                    for (let next_ply = ply + 1; next_ply < pv_length[ply + 1]; next_ply++) {
                        // copy move from deeper ply into a current ply's line
                        pv_table[ply][next_ply] = pv_table[ply + 1][next_ply];
                    }
                    // adjust PV length
                    pv_length[ply] = pv_length[ply + 1];
                }
                if (currentEval > alpha) {
                    alpha = currentEval
                }
                if (beta <= alpha) {
                    if (move.ate !== null) {
                        break
                    }
                    const arr = mem.get(depth)
                    if (arr.find(e => e!== null && isEqualMove(e, move))) {
                        break
                    }
                    for (let j = MAX_KILLER - 2; j >= 0; j--) {
                        arr[j + 1] = arr[j]
                    }
                    arr[0] = move
                    break
                }
            }
            branch = (branch + branchLocal) / 2
            if (illegal === moves.length) {
                if (board.isCheck(currentPlayer)) {
                    return -30000 * depth // faster checkmates
                }
                return 0 // stalemate
            }
            return maxEval
        } else {
            let minEval = 30000
            let illegal = 0
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    board.undoMove()
                    illegal++
                    continue
                }
                branchLocal++
                const currentEval = miniMaxCore(board, depth - 1, alpha, beta, maxPlayer, currentPlayer * -1, prevMoves, mem, ply +1)
                board.undoMove()
                if (currentEval < minEval) {
                    minEval = currentEval
                    pv_table[ply][ply] = move
                    for (let next_ply = ply + 1; next_ply < pv_length[ply + 1]; next_ply++) {
                        // copy move from deeper ply into a current ply's line
                        pv_table[ply][next_ply] = pv_table[ply + 1][next_ply];
                    }
                    // adjust PV length
                    pv_length[ply] = pv_length[ply + 1];
                }

                if (currentEval < beta) {
                    beta = currentEval
                }
                if (beta <= alpha) {
                    if (move.ate !== null) {
                        break
                    }
                    const arr = mem.get(depth)
                    if (arr.find(e => e!== null && isEqualMove(e, move))) {
                        break
                    }
                    for (let j = MAX_KILLER - 2; j >= 0; j--) {
                        arr[j + 1] = arr[j]
                    }
                    arr[0] = move
                    break
                }
            }
            branch = (branch + branchLocal) / 2
            if (illegal === moves.length) {
                if (board.isCheck(currentPlayer)) {
                    return 30000 * depth
                }
                return 0

            }
            return minEval
        }
    }

    const moveOrderRoot = (moves, depth, ply) => {
        const sortMovesO = (a, b) => {
            const pvMove = pv_table[0][ply]
            if (pvMove !== 0 && isEqualMove(a, pvMove)) {
                return -1
            } else if (pvMove !== 0 && isEqualMove(b, pvMove)) {
                return 1
            }
            if (a.ate !== null && b.ate !== null) {
                const aScore = a.piece.points - a.ate.points
                const bScore = b.piece.points - b.ate.points
                return aScore < bScore ? -1: 1
            } else {
                if (a.ate !== null) {
                    return -1
                } else if (b.ate !== null) {
                    return 1
                }
                const aScore = a.piece.colour === Piece.WHITE ? a.piece.whiteScore[a.newCell.row][a.newCell.col] : a.piece.blackScore[a.newCell.row][a.newCell.col]
                const bScore = b.piece.colour === Piece.WHITE ? b.piece.whiteScore[b.newCell.row][b.newCell.col] : b.piece.blackScore[b.newCell.row][b.newCell.col]
                return aScore < bScore ? 1: -1

            }
        }
        moves.sort(sortMovesO)
    }

    const moveOrder = (moves, mem, depth, ply) => {

        const sortMovesO = (a, b) => {
            const pvMove = pv_table[0][ply]

            if (pvMove !== 0 && isEqualMove(a, pvMove)) {
                return -1
            } else if (pvMove !== 0 && isEqualMove(b, pvMove)) {
                return 1
            }
            if (a.ate !== null && b.ate !== null) {
                const aScore = a.piece.points - a.ate.points
                const bScore = b.piece.points - b.ate.points
                return aScore < bScore ? -1: 1
            } else {
                if (a.ate !== null) {
                    return -1
                } else if (b.ate !== null) {
                    return 1
                }
                const memSlot = mem.get(depth)
                for (let slot = 0; slot < memSlot.length; slot++) {
                    const killerMove = memSlot[slot]
                    if (killerMove !== null && isEqualMove(a, killerMove)) {
                        return -1
                    }
                    if (killerMove !== null && isEqualMove(b, killerMove)) {
                        return 1
                    }
                }

                const aScore = a.piece.colour === Piece.WHITE ? a.piece.whiteScore[a.newCell.row][a.newCell.col] : a.piece.blackScore[a.newCell.row][a.newCell.col]
                const bScore = b.piece.colour === Piece.WHITE ? b.piece.whiteScore[b.newCell.row][b.newCell.col] : b.piece.blackScore[b.newCell.row][b.newCell.col]
                return aScore < bScore ? 1: -1

            }
        }
        moves.sort(sortMovesO)
    }

    const isEqualMove = (a, b) => {
        if (a.newCell.row === b.newCell.row && a.newCell.col === b.newCell.col && a.oldCell.row === b.oldCell.row && a.oldCell.col === b.oldCell.col && a.piece.constructor === b.piece.constructor) {
            if (a.ate !== null && b.ate !== null) {
                return a.ate.constructor === b.ate.constructor
            }
            return a.ate === b.ate
        }
        return false
    }

    const sortMoves = (a, b) => {
        if (a.ate !== null && b.ate !== null) {
            const aScore = a.piece.points - a.ate.points
            const bScore = b.piece.points - b.ate.points
            return aScore < bScore ? -1: 1
        } else {
            if (a.ate !== null) {
                return -1
            } else if (b.ate !== null) {
                return 1
            } else {
                const aScore = a.piece.colour === Piece.WHITE ? a.piece.whiteScore[a.newCell.row][a.newCell.col] : a.piece.blackScore[a.newCell.row][a.newCell.col]
                const bScore = b.piece.colour === Piece.WHITE ? b.piece.whiteScore[b.newCell.row][b.newCell.col] : b.piece.blackScore[b.newCell.row][b.newCell.col]
                return aScore < bScore ? 1: -1
            }
        }
    }





    const quiesce = (alpha, beta, board, colour, depth, prevMoves) => {
        const evaluation = board.getScore(colour, prevMoves)
        if (depth === 0) {
            return evaluation
        }
        if (evaluation >= beta) {
            return beta
        }

        alpha = Math.max(alpha, evaluation)
        const moves = board.getAllMoves(colour)
        moves.sort(sortMoves)
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i]
            if (move.ate !== null) { //  && move.ate.points > move.piece.points
                board.movePiece(move.piece, move)
                let score = -quiesce(-beta, -alpha, board, colour * -1, depth - 1, prevMoves)
                board.undoMove()
                if (score >= beta) {
                    return beta
                }
                if (score > alpha) {
                    alpha = score
                }
            } else {
                break
            }
        }
        return alpha
    }
    //
    // const quiesceOdd = (alpha, beta, board, colour, depth) => {
    //     // const evaluation = evaluate(board, colour)
    //     let evaluation
    //     const boardHash = board.getBoardHash() + colour.toString()
    //     if (mem.has(boardHash)) {
    //         evaluation = mem.get(boardHash)
    //     } else {
    //         evaluation = evaluate(board, colour)
    //         mem.set(boardHash, evaluation)
    //     }
    //
    //     if (depth === 0) {
    //         return evaluation
    //     }
    //     if (evaluation >= beta) {
    //         return beta
    //     }
    //
    //     alpha = Math.max(alpha, evaluation)
    //     const moves = board.getAllMoves(colour)
    //     moves.sort(sortMovesQuiesce)
    //     for (const move of moves) {
    //         if (move.ate !== null) { //  && move.ate.points > move.piece.points
    //             board.movePiece(move.piece, move)
    //             let score = -quiesce(-beta, -alpha, board, switchColour(colour), depth - 1)
    //             board.undoMove()
    //             if (score >= beta) {
    //                 return beta
    //             }
    //             if (score > alpha) {
    //                 alpha = score
    //             }
    //         }
    //     }
    //     return alpha
    // }

    // const negaMax = (depth, board, colour, maxColour) => {
    //     if (depth === 0) {
    //         return evaluate(board, maxColour)
    //     }
    //     const testGameOver = board.isGameOver(colour).isGameOver
    //     if (testGameOver && colour === maxColour) {
    //         return -Number.MAX_VALUE
    //     }
    //     if (testGameOver && colour !== maxColour) {
    //         return Number.MAX_VALUE
    //     }
    //     let max = -Number.MAX_VALUE
    //     const moves = board.getAllMoves(colour)
    //     for (const move of moves) {
    //         board.movePiece(move.piece, move)
    //         const currentEval = -negaMax(depth - 1, board, switchColour(colour), maxColour)
    //         if (currentEval > max) {
    //             max = currentEval
    //         }
    //         board.undoMove()
    //     }
    //     return max
    // }
    // const rootNegaMax = (depth, board, colour, maxColour) => {
    //     const rootMoves = board.getAllMoves(maxColour)
    //     let max = -Number.MAX_VALUE
    //     const randomIndex = Math.floor(Math.random() * (rootMoves.length - 1))
    //     let bestMove = rootMoves.length > 0 ? rootMoves[randomIndex] : null
    //     for (const move of rootMoves) {
    //         board.movePiece(move.piece, move)
    //         const score = negaMax(depth, board, colour, maxColour)
    //         if (score > max) {
    //             max = score
    //             bestMove = move
    //         }
    //         board.undoMove()
    //     }
    //     return bestMove
    //
    // }
    class Board {
        board;

        constructor() {
            this.board = this.newBoard()
            this.moves = []
        }

        newBoard = () => {
            const startingBoard = [
                [new Rook(Piece.BLACK, new Cell(0,0)), new Knight(Piece.BLACK, new Cell(0, 1)), new Bishop(Piece.BLACK, new Cell(0, 2)), new Queen(Piece.BLACK, new Cell(0, 3)), new King(Piece.BLACK, new Cell(0, 4)), new Bishop(Piece.BLACK, new Cell(0, 5)), new Knight(Piece.BLACK, new Cell(0, 6)), new Rook(Piece.BLACK, new Cell(0,7))],
                [new Pawn(Piece.BLACK, new Cell(1, 0)), new Pawn(Piece.BLACK, new Cell(1, 1)), new Pawn(Piece.BLACK, new Cell(1, 2)), new Pawn(Piece.BLACK, new Cell(1, 3)), new Pawn(Piece.BLACK, new Cell(1, 4)), new Pawn(Piece.BLACK, new Cell(1, 5)), new Pawn(Piece.BLACK, new Cell(1, 6)), new Pawn(Piece.BLACK, new Cell(1, 7))],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [new Pawn(Piece.WHITE, new Cell(6, 0)), new Pawn(Piece.WHITE, new Cell(6, 1)), new Pawn(Piece.WHITE, new Cell(6, 2)), new Pawn(Piece.WHITE, new Cell(6, 3)), new Pawn(Piece.WHITE, new Cell(6, 4)), new Pawn(Piece.WHITE, new Cell(6, 5)), new Pawn(Piece.WHITE, new Cell(6, 6)), new Pawn(Piece.WHITE, new Cell(6, 7))],
                [new Rook(Piece.WHITE, new Cell(7,0)), new Knight(Piece.WHITE, new Cell(7, 1)), new Bishop(Piece.WHITE, new Cell(7, 2)), new Queen(Piece.WHITE, new Cell(7, 3)), new King(Piece.WHITE, new Cell(7, 4)), new Bishop(Piece.WHITE, new Cell(7, 5)), new Knight(Piece.WHITE, new Cell(7, 6)), new Rook(Piece.WHITE, new Cell(7,7))],
            ]
            return startingBoard
        }
        // update piece square tables for endgame
        setEndGame = () => {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null && piece.whiteScoreEnd !== undefined) {
                        if (piece.colour === Piece.WHITE) {
                            piece.whiteScore = piece.whiteScoreEnd
                        } else {
                            piece.blackScore = piece.blackScoreEnd
                        }
                    }
                }
            }
        }
        // update values of pieces
        updatePieceValues = (totalMoves) => {
            // set if colour can castle here
            if (this.kingHasMoved(Piece.WHITE) || this.rookHasMoved(Piece.WHITE, King.KING_SIDE) || this.rookHasMoved(Piece.WHITE, King.QUEEN_SIDE)) {
                whiteCanCastle = false
            }
            if (this.kingHasMoved(Piece.BLACK) || this.rookHasMoved(Piece.BLACK, King.KING_SIDE) || this.rookHasMoved(Piece.BLACK, King.QUEEN_SIDE)) {
                blackCanCastle = false
            }
            const MOVE_THRESHOLD = 12
            // for knight, -5 per missing pawn of any colour done
            // for bishop, fianchetto bonus points, control over square colour (using pawns), bishop pair bonus
            // rook penalty for trap by king, bonus for open file, bonus for each missing pawn
            // pawn, increase value +30 if past pawn (no pawns of opposing colour on the 3 cols), decrease value if doubled (-10)

            let whitePawnCount = 0
            let blackPawnCount = 0
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        if (piece instanceof Pawn) {
                            if (piece.colour === Piece.WHITE) {
                                whitePawnCount++
                            } else {
                                blackPawnCount++
                            }
                        }
                    }
                }
            }
            const openFiles = []
            for (let col = 0; col < 8; col++) {
                let hasPawn = false
                for (let row = 0; row < 8; row++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        if (piece instanceof Pawn) {
                            hasPawn = true
                            break
                        }
                    }
                }
                if (!hasPawn) {
                    openFiles.push(col)
                }
            }

            // first ten moves, bad to move queen out, and encourage piece development
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        if (piece instanceof Queen) {
                            if (totalMoves <= MOVE_THRESHOLD) {
                                if (piece.colour === Piece.WHITE) {
                                    piece.whiteScore[7][3]+=50
                                } else {
                                    piece.blackScore[0][3]+=50
                                }
                            }
                        }
                        if (piece instanceof Knight) {
                            piece.points-= ((16 - whitePawnCount - blackPawnCount) * 3)
                            if (totalMoves <= MOVE_THRESHOLD) {
                                if (piece.colour === Piece.WHITE) {
                                    piece.whiteScore[7][1]-=50
                                    piece.whiteScore[7][6]-=50
                                } else {
                                    piece.blackScore[0][1]-=50
                                    piece.blackScore[0][6]-=50
                                }
                            }
                        }
                        if (piece instanceof Bishop) {
                            piece.points+= ((16 - whitePawnCount - blackPawnCount) * 3)
                            if (totalMoves <= MOVE_THRESHOLD) {
                                if (piece.colour === Piece.WHITE) {
                                    piece.whiteScore[7][2]-=50
                                    piece.whiteScore[7][5]-=50
                                } else {
                                    piece.blackScore[0][2]-=50
                                    piece.blackScore[0][5]-=50
                                }
                            }
                        }
                        if (piece instanceof Rook) {
                            piece.points+= ((16 - whitePawnCount - blackPawnCount) * 3)
                            for (const openCol of openFiles) {
                                for (let openRow = 0; openRow<8; openRow++) {
                                    piece.whiteScore[openRow][openCol]+= 15
                                    piece.blackScore[openRow][openCol]+= 15
                                }
                            }
                        }
                        if (piece instanceof Pawn) {
                            let past = true
                            if (col + 1 < 8) {
                                if (piece.colour === Piece.WHITE) {
                                    for (let i = row  - 1; i >= 0; i--) {
                                        if (this.getPiece(i, col + 1) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                } else {
                                    for (let i = row + 1; i < 8; i++) {
                                        if (this.getPiece(i, col + 1) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                }

                            }
                            if (col < 8) {
                                if (piece.colour === Piece.WHITE) {
                                    for (let i = row  - 1; i >= 0; i--) {
                                        if (this.getPiece(i, col) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                } else {
                                    for (let i = row + 1; i < 8; i++) {
                                        if (this.getPiece(i, col) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                }

                            }
                            if (col - 1 >= 0) {
                                if (piece.colour === Piece.WHITE) {
                                    for (let i = row  - 1; i >= 0; i--) {
                                        if (this.getPiece(i, col - 1) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                } else {
                                    for (let i = row + 1; i < 8; i++) {
                                        if (this.getPiece(i, col - 1) instanceof Pawn) {
                                            past = false
                                        }
                                    }
                                }
                            }
                            if (past) {
                                if (piece.colour === Piece.WHITE) {
                                    piece.points+= (20 * (6 - row))
                                } else {
                                    piece.points+= (20 * (row - 1))
                                }

                            }
                            let doubled = false
                            for (let i = 0; i < 8; i++) {
                                if (piece instanceof Pawn && i !== row) {
                                    doubled = true
                                }
                            }
                            if (doubled) {
                                piece.points-=10
                            }
                        }
                    }
                }
            }
        }

        isEndGame = () => {
            // End game defined by: either side has a queen + pawns only / either side has at most 2 minor pieces
            let countWhitePieces = 0
            let countBlackPieces = 0
            let countWhiteQueen = 0
            let countBlackQueen = 0
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece instanceof Queen) {
                        if (piece.colour === Piece.WHITE) {
                            countWhiteQueen++
                        } else {
                            countBlackQueen++
                        }
                    }
                    if (piece instanceof Rook || piece instanceof Bishop || piece instanceof Knight) {
                        if (piece.colour === Piece.WHITE) {
                            countWhitePieces++
                        } else {
                            countBlackPieces++
                        }
                    }
                }
            }
            return ((countWhiteQueen <= 1 && countWhitePieces <=1) || (countBlackQueen <= 1  && countBlackPieces <=1))
                || ((countWhitePieces <=3 && countWhiteQueen <= 0) || (countBlackPieces <=3  && countBlackQueen <= 0))
        }

        setBoardString = (boardString) => {
            const newBoard = []
            for (let row = 0; row < 8; row++) {
                const newRow = []
                for (let col = 0; col < 8; col++) {
                    const pieceString = boardString[row][col]
                    if (pieceString === null) {
                        newRow.push(null)
                    } else {
                        const pieceColour = pieceString.slice(0, 1)
                        const actualColour = pieceColour === "w" ? Piece.WHITE : Piece.BLACK
                        const piece = pieceString.slice(1, 2)
                        if (piece === "b") {
                            newRow.push(new Bishop(actualColour, new Cell(row, col)))
                        } else if (piece === 'k') {
                            newRow.push(new King(actualColour, new Cell(row, col)))
                        } else if (piece === 'n') {
                            newRow.push(new Knight(actualColour, new Cell(row, col)))
                        } else if (piece === 'p') {
                            newRow.push(new Pawn(actualColour, new Cell(row, col)))
                        } else if (piece === 'q') {
                            newRow.push(new Queen(actualColour, new Cell(row, col)))
                        } else if (piece === 'r') {
                            newRow.push(new Rook(actualColour, new Cell(row, col)))
                        } else {
                            newRow.push(null)
                        }
                    }
                }
                newBoard.push(newRow)
            }
            this.board = newBoard
        }

        getBoardHash = () => {
            let str = ""
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col)) {
                        str += this.getPiece(row, col).getString()
                    } else {
                        str += " "
                    }
                }
            }
            return str
        }

        /**
         * Returns the board represented by the array
         */
        getBoard = () => {
            return this.board
        }
        /**
         * Returns piece at the coordinates
         */
        getPiece = (row, col) => {
            return this.board[row][col]
        }

        /**
         * Returns if the cell is empty
         */
        isEmpty = (row, col) => {
            if (this.isOutSide(row, col)) {
                return false
            }
            return this.board[row][col] === null
        }
        isUnderCheck = (colour) => {
            return false
        }
        isOutSide = (row, col) => {
            return row < 0 || col < 0 || row > 7 || col > 7
        }

        canEat = (row, col, colour) => {
            return !this.isOutSide(row, col) && !this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour
        }


        canMove = (row, col) => {
            return !this.isOutSide(row, col) && this.isEmpty(row, col)
        }

        canKingMove = (row, col, colour) => {
            const directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
            for (const direction of directions) {
                const newRow = row + direction[0]
                const newCol = col + direction[1]
                if (!this.isOutSide(newRow, newCol) && !this.isEmpty(newRow, newCol)
                    && (this.getPiece(newRow, newCol).name === Piece.KING && this.getPiece(newRow, newCol).colour !== colour)) {
                    return false
                }
            }
            return true
        }

        movePiece = (piece, move) => {
            move.piece.movePiece(move, this)
            this.moves.push(move)
        }

        undoMove = () => {
            if (this.moves.length > 0) {
                const move = this.moves.pop()
                const prevRow = move.oldCell.row
                const prevCol = move.oldCell.col
                const piece = this.board[move.newCell.row][move.newCell.col]
                if (piece === null) {
                    console.log(this.getBoardString(), move)
                }

                this.board[prevRow][prevCol] = piece
                piece.cell.row = prevRow
                piece.cell.col = prevCol
                if (move.isEnPassant) { // add back pawn
                    this.board[move.ate.cell.row][move.ate.cell.col] = move.ate
                    this.board[move.newCell.row][move.newCell.col] = null
                    return true
                } else if (move.isPromotion) { // remove piece, add back pawn
                    this.board[prevRow][prevCol] = new Pawn(piece.colour, piece.cell, piece.moves)
                } else if (move.castle.isCastle) { // king will be undone, need to undo rook
                    this.board[move.castle.rook.oldCell.row][move.castle.rook.oldCell.col] = move.castle.rook.piece
                    move.castle.rook.piece.cell.row = move.castle.rook.oldCell.row
                    move.castle.rook.piece.cell.col = move.castle.rook.oldCell.col
                    this.board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = null
                }
                this.board[move.newCell.row][move.newCell.col] = move.ate
                return true
            }
            return false
        }

        kingHasMoved = (colour) => {
            for (let i = 0; i < this.moves.length; i++) {
                const move = this.moves[i]
                if (move.piece.name === Piece.KING && move.piece.colour === colour) {
                    return true
                }
            }
            return false
        }

        rookHasMoved = (colour, side) => {
            const row = colour === Piece.BLACK ? 0 : 7
            const col = side === King.KING_SIDE ? 7 : 0
            if (!(this.getPiece(row, col) !== null && this.getPiece(row, col).name === Piece.ROOK)) { // no rook on cell
                return true
            }
            for (const move of this.moves) {
                if (move.piece.name === Piece.ROOK && move.piece.colour === colour && move.oldCell.row === row && move.oldCell.col === col) {
                    return true
                }
            }
            return false
        }

        castlingSquaresIsEmpty = (colour, side) => {
            const row = colour === Piece.BLACK ? 0 : 7
            const cols = side === King.KING_SIDE ? [5,6] : [1,2,3]
            for (const col of cols) {
                if (!this.isEmpty(row, col)) {
                    return false
                }
            }
            return true
        }

        // returns if colour is under check, need check for castling
        isIllegal = (colour, move) => {
            // get colour king first
            let king;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col)) {
                        const piece = this.getPiece(row, col)
                        if (piece.name === Piece.KING) {
                            if (piece.colour === colour) {
                                king = piece
                            }
                        }
                    }
                }
            }
            if (move.castle.isCastle) {
                const moves = this.getAllMoves(colour * -1)
                const row = move.newCell.row
                if (move.newCell.col === 6) { // kingside
                    for (const opp of moves) {
                        const moveRow = opp.newCell.row
                        const moveCol = opp.newCell.col
                        if (moveRow === row && (moveCol === 6 || moveCol === 5 || moveCol === 4)) {
                            return true
                        }
                    }
                } else {
                    for (const opp of moves) {
                        const moveRow = opp.newCell.row
                        const moveCol = opp.newCell.col
                        if (moveRow === row && (moveCol === 1 || moveCol === 2 || moveCol === 3 || moveCol === 4)) {
                            return true
                        }
                    }
                }
            }

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour) {
                        const piece = this.getPiece(row, col)
                        if (piece.isCheck(this, king)) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        // check if colour is under check
        isCheck = (colour) => {
            let king;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col)) {
                        const piece = this.getPiece(row, col)
                        if (piece.name === Piece.KING) {
                            if (piece.colour === colour) {
                                king = piece
                            }
                        }
                    }
                }
            }
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour) {
                        const piece = this.getPiece(row, col)
                        if (piece.isCheck(this, king)) {
                            return true
                        }
                    }
                }
            }
            return false
        }

        /**
         * Checks if game is over for colour, means other colour wins
         * @param colour
         * @return {*[]}
         */

        getAllMoves = (colour) => {
            let squares = []
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col) && this.getPiece(row, col).colour === colour) {
                        const piece = this.getPiece(row, col)
                        const moves = piece.getMoves(this)
                        squares = squares.concat(moves)
                    }
                }
            }
            return squares
        }
        /**
         * Goes through board for positional eval, like piece development, hardcoded for black
         */
        scanSquaresScore = () => {
            let score = 0
            let materialScore = 0
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        // material score
                        if (piece.colour === Piece.WHITE) {
                            materialScore += piece.points
                        } else {
                            materialScore -= piece.points
                        }

                        // development / positional score
                        if (piece.colour === Piece.WHITE) {
                            score += piece.whiteScore[row][col]
                        } else {
                            score -= piece.blackScore[row][col]
                        }
                    }
                }
            }

            return score + materialScore
        }

        /**
         * used for minimax heuristics
         * @param colour colour making the next move
         * @param prevMoves total moves available
         * @return {number} score of position
         */
        getScore = (colour, prevMoves) => {
            const positionalScore = this.scanSquaresScore()
            return (positionalScore + prevMoves.length * 5) * colour * -1
        }

        getBoardString = () => {
            const newBoard = []
            for (let row = 0; row < 8; row++) {
                const newRow = []
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        newRow.push(piece.getString())
                    } else {
                        newRow.push(null)
                    }
                }
                newBoard.push(newRow)
            }
            return newBoard
        }

    }
    /**
     * This class represents a coordinate on the chess board
     */
    class Cell {
        constructor(row, col) {
            this.row = row
            this.col = col
        }
    }
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

        getMoveString = () => {
            return {
                oldCellRow: this.oldCell.row,
                oldCellCol: this.oldCell.col,
                newCellRow: this.newCell.row,
                newCellCol: this.newCell.col,
                pieceString: this.piece.getString(),
                isEnPassant: this.isEnPassant,
                castle: this.castle.isCastle === false ? {isCastle: false} : {isCastle: true,
                    rook:{
                    pieceString : this.castle.rook.piece.getString(),
                    oldCellRow: this.castle.rook.oldCell.row,
                    oldCellCol: this.castle.rook.oldCell.col,
                    newCellRow: this.castle.rook.newCell.row,
                    newCellCol: this.castle.rook.newCell.col,
                }},
                ate: this.ate !== null ? this.ate.getString() : null,
                isPromotion: this.isPromotion
            }
        }
        static parseMove = (board, data) => {
            const parseMove = new Move(
                new Cell(data.oldCellRow, data.oldCellCol),
                new Cell(data.newCellRow, data.newCellCol),
                Piece.parsePieceString(data.pieceString),
                data.isEnPassant,
                {isCastle: false},
                null,
                data.isPromotion
            )

            if (data.castle.isCastle) {
                const rookObj = data.castle.rook
                parseMove.castle.isCastle = true
                parseMove.castle.rook = new Move(new Cell(rookObj.oldCellRow, rookObj.oldCellCol)
                    , new Cell(rookObj.newCellRow, rookObj.newCellCol), board.getPiece(rookObj.oldCellRow, rookObj.oldCellCol))
            }
            return parseMove
        }

    }
    class Piece {
        static WHITE = -1
        static BLACK = 1
        static ROOK = "r"
        static BISHOP = "b"
        static KNIGHT = "n"
        static KING = "k"
        static QUEEN = "q"
        static PAWN = "p"
        constructor(colour, cell) {
            this.colour = colour // white or black
            this.cell = cell
        }
        static parsePieceString = (pieceString) => {
            const pieceColour = pieceString.slice(0, 1)
            const actualColour = pieceColour === "w" ? Piece.WHITE : Piece.BLACK
            const piece = pieceString.slice(1, 2)
            if (piece === "b") {
                return new Bishop(actualColour, new Cell(0, 0))
            } else if (piece === 'k') {
                return new King(actualColour, new Cell(0, 0))
            } else if (piece === 'n') {
                return new Knight(actualColour, new Cell(0, 0))
            } else if (piece === 'p') {
                return new Pawn(actualColour, new Cell(0, 0))
            } else if (piece === 'q') {
                return new Queen(actualColour, new Cell(0, 0))
            } else if (piece === 'r') {
                return new Rook(actualColour, new Cell(0, 0))
            } else {
                return null
            }
        }
    }

    class Bishop extends Piece {
        directions = [[1,1], [-1,-1], [1,-1],[-1,1]]
        points = 330
        name = Piece.BISHOP
        whiteScore = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ]
        blackScore = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20],
        ]
        constructor(colour, cell) {
            super(colour, cell)
        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                    moves.push(move)
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        // check if piece is checking the enemy king
        isCheck = (board, king) => {
            const row = this.cell.row
            const col = this.cell.col
            const kingRow = king.cell.row
            const kingCol = king.cell.col
            const rowDiff = Math.abs(row - kingRow)
            const colDiff = Math.abs(col - kingCol)
            if (rowDiff !== colDiff) {
                return false
            }
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    if (board.canEat(newRow, newCol, this.colour)) {
                        if (board.getPiece(newRow, newCol).name === Piece.KING) {
                            return true
                        }
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return false

        }

        /**
         * Moves the piece, updates the board object as well
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "b"
        }
    }
    class King extends Piece {
        directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
        static KING_SIDE = -1
        static QUEEN_SIDE = 1
        name = Piece.KING
        points = 10000

        whiteScore = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ]

        blackScore = [
            [20, 30, 10,  0,  0, 10, 30, 20],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
        ]
        whiteScoreEnd = [
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ]
        blackScoreEnd = [
            [-50,-30,-30,-30,-30,-30,-30,-50],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-50,-40,-30,-20,-20,-30,-40,-50],
        ]
        constructor(colour, cell) {
            super(colour, cell)
        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                const newRow = row + currentRow
                const newCol = col + currentCol
                if (((board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol))) && board.canKingMove(newRow, newCol, this.colour)) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                    moves.push(move)
                }
            }
            // king and rook has not moved, illegal check later
            if (whiteCanCastle && board.castlingSquaresIsEmpty(this.colour, King.KING_SIDE) && !board.rookHasMoved(this.colour, King.KING_SIDE) && !board.kingHasMoved(this.colour)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 6
                moves.push(new Move(new Cell(currentRow, currentCol), new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 7), new Cell(row, 5), board.getPiece(row, 7))}))
            }
            if (blackCanCastle && board.castlingSquaresIsEmpty(this.colour, King.QUEEN_SIDE) && !board.rookHasMoved(this.colour, King.QUEEN_SIDE) && !board.kingHasMoved(this.colour)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 2
                moves.push(new Move(new Cell(currentRow, currentCol), new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 0), new Cell(row, 3), board.getPiece(row, 0))}))
            }


            return moves
        }
        // check if piece is checking the enemy king
        isCheck = (board, king) => {
            return false
        }
        /**
         * Moves the piece, updates the board object as well
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            if (move.castle.isCastle) {
                board[move.castle.rook.newCell.row][move.castle.rook.newCell.col] = move.castle.rook.piece
                board[move.castle.rook.oldCell.row][move.castle.rook.oldCell.col] = null
                move.castle.rook.piece.cell.row = move.castle.rook.newCell.row
                move.castle.rook.piece.cell.col = move.castle.rook.newCell.col
            }
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "k"
        }
    }
    class Knight extends Piece {
        directions = [[1, 2], [1, -2], [2, 1], [2, -1], [-1, 2], [-1, -2], [-2, 1], [-2, -1]]

        points = 320
        name = Piece.KNIGHT

        whiteScore = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ]

        blackScore = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50],
        ]
        constructor(colour, cell) {
            super(colour, cell)

        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const newRow = row + currentRow
                const newCol = col + currentCol
                if (board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol)) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                    moves.push(move)
                }
            }
            return moves
        }
        // check if piece is checking the enemy king
        isCheck = (board, king) => {
            const row = this.cell.row
            const col = this.cell.col
            const kingRow = king.cell.row
            const kingCol = king.cell.col
            const rowDiff = Math.abs(row - kingRow)
            const colDiff = Math.abs(col - kingCol)
            if (rowDiff + colDiff !== 3) {
                return false
            }
            return !(rowDiff === 0 || colDiff === 0);

        }
        /**
         * Moves the piece, updates the board object as well
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "n"
        }
    }
    class Pawn extends Piece {
        points = 100
        name = Piece.PAWN

        whiteScore = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ]
        whiteScoreEnd = [
            [100,  100,  100,  100,  100,  100,  100,  100],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ]
        blackScore = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10,-40,-40, 10, 10,  5],
            [5, 10,20,  0,  0,-10, -5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [0,  0,  0,  0,  0,  0,  0,  0],
        ]
        blackScoreEnd = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10,-40,-40, 10, 10,  5],
            [5, 10,20,  0,  0,-10, -5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [100,  100,  100,  100,  100,  100,  100,  100],
        ]
        constructor(colour, cell) {
            super(colour, cell)

        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            const moves = []
            let newRow = this.cell.row + 1 * this.colour
            let newCol = this.cell.col
            if (board.canMove(newRow, newCol)) {
                const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol),
                    this, undefined, undefined, undefined,
                    newRow === 0 || newRow === 7)
                    moves.push(move)

                newRow = this.cell.row + 2 * this.colour
                if (board.canMove(newRow, newCol) && (newRow === 3 || newRow === 4)) {
                    if (this.colour === Piece.BLACK && this.cell.row === 1) {
                        const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)

                            moves.push(move)

                    } else if (this.colour === Piece.WHITE && this.cell.row === 6) {
                        const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                            moves.push(move)
                    }

                }
            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col + 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                    moves.push(move)
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col + 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this, true)
                        moves.push(move)
                }

            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col - 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                    moves.push(move)
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col - 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this, true)
                    moves.push(move)
                }

            }
            return moves
        }
        isCheck = (board, king) => {
            const kingRow = king.cell.row
            const kingCol = king.cell.col
            const newRow = this.cell.row + 1 * this.colour
            const newCol = this.cell.col + 1
            const newColOpp = this.cell.col - 1
            return newRow === kingRow && (newCol === kingCol || newColOpp === kingCol)
        }

        /**
         * Moves the piece
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            // const old = board[move.oldCell.row][move.oldCell.col]
            // promotion
            if (move.isEnPassant) {
                const prevMove = boardObject.moves.slice(-1)[0]
                const oldPiece = board[prevMove.newCell.row][prevMove.newCell.col]
                if (oldPiece !== null) {
                    move.ate = oldPiece
                }
                board[prevMove.newCell.row][prevMove.newCell.col] = null
            }
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
            if (move.isPromotion) {
                board[newRow][newCol] = new Queen(this.colour, this.cell)
            }
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "p"
        }
    }
    class Queen extends Piece {
        directions = [[1,1], [-1,-1], [1,-1],[-1,1], [0,1], [1,0], [0,-1],[-1,0]]
        points = 900
        name = Piece.QUEEN

        whiteScore = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ]
        blackScore = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20],
        ]
        constructor(colour, cell) {
            super(colour, cell)

        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                        moves.push(move)
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        isCheck = (board, king) => {
            const row = this.cell.row
            const col = this.cell.col
            const kingRow = king.cell.row
            const kingCol = king.cell.col
            const rowDiff = Math.abs(row - kingRow)
            const colDiff = Math.abs(col - kingCol)
            if ((rowDiff !== colDiff) && kingCol !== col && kingRow !== row) {
                return false
            }
            const currentRow = this.cell.row
            const currentCol = this.cell.col
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    if (board.canEat(newRow, newCol, this.colour)) {
                        if (board.getPiece(newRow, newCol).name === Piece.KING) {
                            return true
                        }
                        break;
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return false

        }

        /**
         * Moves the piece, updates the board object as well
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }
            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "q"
        }
    }
    class Rook extends Piece {
        directions = [[0,1], [1,0], [0,-1],[-1,0]]
        points = 500
        name = Piece.ROOK
        whiteScore = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ]
        blackScore = [
            [0,  0,  4,  5,  5,  10,  0,  0],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0],
        ]
        constructor(colour, cell) {
            super(colour, cell)

        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    const move = new Move(new Cell(currentRow, currentCol), new Cell(newRow, newCol), this)
                        moves.push(move)
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        isCheck = (board, king) => {
            const row = this.cell.row
            const col = this.cell.col
            const kingRow = king.cell.row
            const kingCol = king.cell.col
            if (kingCol !== col && kingRow !== row) {
                return false
            }
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    if (board.canEat(newRow, newCol, this.colour)) {
                        if (board.getPiece(newRow, newCol).name === Piece.KING) {
                            return true
                        }
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return false

        }
        /**
         * Moves the piece, updates the board object as well
         */
        movePiece = (move, boardObject) => {
            const board = boardObject.getBoard()
            const newRow = move.newCell.row
            const newCol = move.newCell.col
            const oldPiece = board[newRow][newCol]
            if (oldPiece !== null) {
                move.ate = oldPiece
            }

            board[newRow][newCol] = this
            board[move.oldCell.row][move.oldCell.col] = null
            this.cell = new Cell(newRow, newCol)
        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "r"
        }
    }

        try {
            const data = message.data
            const boardString = data[0]
            const depth = data[1]
            const moveString = data[2]
            const colour = data[3]
            const pv = data[4]
            totalMoves = moveString.length
            if (totalMoves === 0) {
                if (colour === Piece.WHITE) {
                    // equal chance to play d4, e4
                    const moves = [
                        new Move(new Cell(6, 3), new Cell(4,3), new Pawn(Piece.WHITE, new Cell(6, 3))),
                        new Move(new Cell(6, 4), new Cell(4,4), new Pawn(Piece.WHITE, new Cell(6, 4))),
                    ]
                    const randomIndex = Math.round(Math.random() * (moves.length - 1))

                    postMessage(moves[randomIndex].getMoveString())
                }
            } else if (totalMoves === 1) {
                // equal chance to play c5 / e5, in response to e4
                const getMove = moveString.map(x => Move.parseMove(undefined, x))[0]
                if (getMove.oldCell.row === 6 && getMove.oldCell.col === 4 && getMove.newCell.row === 4 && getMove.newCell.col === 4) {
                    const moves = [
                        new Move(new Cell(1, 2), new Cell(3,2), new Pawn(Piece.BLACK, new Cell(1, 2))),
                        new Move(new Cell(1, 4), new Cell(3,4), new Pawn(Piece.BLACK, new Cell(1, 4))),
                    ]
                    const randomIndex = Math.round(Math.random() * (moves.length - 1))

                    postMessage(moves[randomIndex].getMoveString())
                } else {
                    const nextMove = ab(boardString, depth, moveString, colour, pv)
                    postMessage(nextMove)
                }
            } else {
                const nextMove = ab(boardString, depth, moveString, colour, pv)
                postMessage(nextMove)
            }
        } catch (e) {
            postMessage({isError: true, message:"Error: " + e})
        }

}
// eslint-disable-next-line no-restricted-globals,no-undef
self.addEventListener("message", test);
