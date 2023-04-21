let totalMoves = 0
let isEndGame = false
const test = async (message) => {
   // https://chess.stackexchange.com/questions/40362/my-transposition-tables-implementation-slows-down-alpha-beta-pruning
    // https://github.com/maksimKorzh/chess_programming/blob/master/src/negamax/tutorials/alpha-beta_quiescence_search/chess.c
    //https://stackoverflow.com/questions/29990116/alpha-beta-prunning-with-transposition-table-iterative-deepening
    // console.log("mem", mem.size)
    // TODO: check if endgame before running search, set score tables before search, done after set board string
    // End game defined by: either side has a queen + pawns only / either side has at most 2 minor pieces
    // TODO: update piece score tables based on position before running search, done after set board string
    // for knight, -5 per missing pawn of any colour
    // for bishop, fianchetto bonus points, control over square colour (using pawns), bishop pair bonus
    // rook penalty for trap by king, bonus for open file, bonus for each missing pawn
    // pawn, increase value +30 if past pawn (no pawns of opposing colour on the 3 cols), decrease value if doubled (-10)
    let nodes = 0
    const ab =  (boardString, depth, moveString, colour) => {
        const copyBoard = new Board()
        copyBoard.setBoardString(boardString)
        // const start = performance.now()
        copyBoard.moves = moveString.map(x => Move.parseMove(copyBoard, x))
        isEndGame = copyBoard.isEndGame()
        if (isEndGame) {
            console.log("endgame")
            copyBoard.setEndGame()
        }
        copyBoard.updatePieceValues()
        const mem = new Map()
        const result = miniMax(copyBoard, depth, -Number.MAX_VALUE, Number.MAX_VALUE, colour, colour, depth, mem)
        // const result = rootNegaMax(depth, copyBoard, Piece.BLACK, Piece.BLACK)
        // const end = performance.now()
        // console.log(end - start, totalMoves, nodes)
        console.log("eval", nodes)
        console.log("Score", result[1])
        return result[0] // should be a move
    }

    const miniMax = (board, depth, alpha, beta, maxPlayer, currentPlayer, orgDepth, mem) => {
        // nodes++
        if (depth === 0) {
            // const result = evaluate(board, maxPlayer)
            let result
            // if (maxPlayer === currentPlayer && board.moves.slice(-1)[0].ate !== null) {
            //     result = quiesce(alpha, beta, board, currentPlayer, 1)
            // } else {
            //     const boardHash = board.getBoardHash() + maxPlayer.toString()
            //     if (mem.has(boardHash)) {
            //         result = mem.get(boardHash)
            //     } else {
            //         result = evaluate(board, maxPlayer)
            //         mem.set(boardHash, result)
            //     }
            // }
            const boardHash = board.getBoardHash() + maxPlayer.toString()
            const memGet = mem.get(boardHash)
            if (memGet !== undefined) {
                result = memGet
            } else {
                result = board.getScore(maxPlayer)
                mem.set(boardHash, result)
            }
            return [null, result]
        }
        const start = performance.now()
        const moves = board.getAllMoves(currentPlayer) // TODO: time consuming
        const end = performance.now()
        nodes += end - start
        moves.sort(sortMoves)
        const randomIndex = Math.floor(Math.random() * (moves.length - 1))
        let bestMove = moves.length > 0 ? moves[randomIndex] : null

        if (currentPlayer === maxPlayer) {
            let maxEval = -90000
            let illegal = 0
            for (const move of moves) {
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    illegal++
                    board.undoMove()
                    continue
                }
                const currentEval = miniMax(board, depth - 1, alpha, beta, maxPlayer, currentPlayer === Piece.BLACK ? Piece.WHITE : Piece.BLACK, orgDepth, mem)[1]
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
            if (illegal === moves.length) { // TODO: check stalemate
                return [null, -90000]
            }
            return [bestMove, maxEval]
        } else {
            let minEval = 90000
            let illegal = 0
            for (const move of moves) {
                board.movePiece(move.piece, move)
                if (board.isIllegal(currentPlayer, move)) {
                    illegal++
                    board.undoMove()
                    continue
                }
                const currentEval = miniMax(board, depth - 1, alpha, beta, maxPlayer, currentPlayer === Piece.BLACK ? Piece.WHITE : Piece.BLACK, orgDepth, mem)[1]
                board.undoMove()
                if (currentEval < minEval) {
                    minEval = currentEval
                    bestMove = move
                }
                beta = Math.min(beta, currentEval)
                if (beta <= alpha) {
                    break
                }
            }
            if (illegal === moves.length) {
                return [null, 90000]
            }
            return [bestMove, minEval]
        }
    }

    // const sortMovesQuiesce = (a, b) => {
    //     if (a.ate !== null && b.ate !== null) {
    //         const aScore = a.piece.points - a.ate.points
    //         const bScore = b.piece.points - b.ate.points
    //         return aScore < bScore ? 1: -1
    //     } else if (a.ate !== null) {
    //         return -1
    //     } else if (b.ate !== null) {
    //         return 1
    //     }
    //     return 0
    // }
    const sortMoves = (a, b) => {
        if (a.ate !== null && b.ate !== null) {
            const aScore = a.piece.points - a.ate.points
            const bScore = b.piece.points - b.ate.points
            return aScore < bScore ? -1: 1
        } else if (a.ate !== null) {
            return -1
        } else if (b.ate !== null) {
            return 1
        } else {
            const aScore = a.piece.colour === Piece.WHITE ? a.piece.whiteScore[a.newCell.row][a.newCell.col] : a.piece.blackScore[a.newCell.row][a.newCell.col]
            const bScore = b.piece.colour === Piece.WHITE ? b.piece.whiteScore[b.newCell.row][b.newCell.col] : b.piece.blackScore[b.newCell.row][b.newCell.col]
            return aScore < bScore ? 1: -1
        }
    }

    // const quiesce = (alpha, beta, board, colour, depth) => {
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
    //     moves.sort(sortMoves)
    //     for (const move of moves) {
    //         if (move.ate !== null && move.ate.points < move.piece.points) { //  && move.ate.points > move.piece.points
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
        updatePieceValues = () => {
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
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        if (piece instanceof Knight) {
                            piece.points-= ((16 - whitePawnCount - blackPawnCount) * 3)
                        }
                        if (piece instanceof Bishop) {
                            piece.points+= ((16 - whitePawnCount - blackPawnCount) * 3)
                        }
                        if (piece instanceof Rook) {
                            piece.points+= ((16 - whitePawnCount - blackPawnCount) * 3)
                        }
                        if (piece instanceof Pawn) {
                            let past = true
                            if (col + 1 < 8) {
                                for (let i = 0; i < 8; i++) {
                                    if (this.getPiece(i, col + 1) instanceof Pawn) {
                                        past = false
                                    }
                                }
                            }
                            if (col - 1 >= 0) {
                                for (let i = 0; i < 8; i++) {
                                    if (this.getPiece(i, col - 1) instanceof Pawn) {
                                        past = false
                                    }
                                }
                            }
                            if (past) {
                                piece.points+=30
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
            return ((countWhiteQueen <= 1 && countWhitePieces <=0) || (countBlackQueen <= 1  && countBlackPieces <=0))
                || ((countWhitePieces <=2 && countWhiteQueen <= 0) || (countBlackPieces <=2  && countBlackQueen <= 0))
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
            if (this.board[move.oldCell.row][move.oldCell.col] === null) {
                console.log(this.getBoardString(), move.oldCell.row, move.oldCell.col, move.piece.name)
            }
            const result =  this.board[move.oldCell.row][move.oldCell.col].movePiece(move, this)
            this.moves.push(move)
            return result
        }

        undoMove = () => {
            if (this.moves.length > 0) {
                const move = this.moves.pop()
                const prevRow = move.oldCell.row
                const prevCol = move.oldCell.col
                const piece = move.piece
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
            for (const move of this.moves) {
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
            let kingCount = 0 // make sure kings are not eaten
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col)) {
                        const piece = this.getPiece(row, col)
                        if (piece.name === Piece.KING) {
                            kingCount++
                            if (piece.colour === colour) {
                                king = piece
                            }
                        }
                    }
                }
            }
            if (kingCount < 2) {
                return true
            }
            if (move.isCastle) {
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
                        if (moveRow === row && (moveCol === 2 || moveCol === 3 || moveCol === 4)) {
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
        scanSquaresScore = (colour) => {
            let score = 0
            let materialScore = 0
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.getPiece(row, col)
                    if (piece !== null) {
                        if (piece.colour === Piece.WHITE) {
                            materialScore += piece.points
                        } else {
                            materialScore -= piece.points
                        }
                        // const moves = piece.getMoves(this)
                        // //board control
                        // score += moves.length
                        // // piece mobility
                        // if (piece instanceof Bishop) {
                        //     score += (moves.length * 3)
                        // } else if (piece instanceof Knight) {
                        //     score += (moves.length * 3)
                        // } else if (piece instanceof Queen) {
                        //     score += (moves.length * 6)
                        // } else if (piece instanceof Rook) {
                        //     score += (moves.length * 5)
                        // }

                        // development / positional score
                        if (piece.colour === Piece.WHITE) {
                            score += piece.whiteScore[row][col]
                        } else {
                            score -= piece.blackScore[row][col]
                        }

                        // double pawns bad for ai, but good if he doubles opponent's pawn
                        // if (piece.name === Piece.PAWN && piece.colour === Piece.WHITE) {
                        //     if (!this.isEmpty(row + 1, col) && this.getPiece(row + 1, col).name === Piece.PAWN && piece.colour === Piece.WHITE) {
                        //         score -= 20
                        //     }
                        // } else if (piece.name === Piece.PAWN && piece.colour !== Piece.WHITE) {
                        //     if (!this.isEmpty(row - 1, col) && this.getPiece(row - 1, col).name === Piece.PAWN && piece.colour !== Piece.WHITE) {
                        //         score += 20
                        //     }
                        // }
                        // under check == bad, check opponent == good
                        // if (piece.name === Piece.KING && piece.colour === colour) {
                        //     if (this.isCheck(colour, attacked)) {
                        //         score -= 10
                        //     }
                        // }
                        // else if (piece instanceof King && piece.colour === opponentColour) {
                        //     if (this.isCheck(opponentColour, attacked)) {
                        //         score += 10
                        //     }
                        // }
                    }
                }
            }
            // if (this.board[3][4] instanceof Pawn && this.board[3][4].colour === Piece.WHITE
            // && this.board) {
            //     console.log(this.board)
            // }
            return score + materialScore
        }

        /**
         * used for minimax heuristics
         * @param colour colour making the next move
         * @return {number} score of position
         */
        getScore = (colour) => {
            // let materialScore = 0 // material control
            // for (let row = 0; row < 8; row ++) {
            //     for (let col = 0; col < 8; col ++) {
            //         const piece = this.board[row][col]
            //         if (piece instanceof Piece && piece.colour === colour) {
            //             materialScore += piece.points
            //         }
            //         if (piece instanceof Piece && piece.colour !== colour) {
            //             materialScore -= piece.points
            //         }
            //     }
            // }
            // const attackedSquares = this.getAttackingSquares(opponentColour) // heavy operation
            // const attackScore = attackedSquares[0].length // board control
            // const defenseScore = attackedSquares[1].length // defense
            const positionalScore = this.scanSquaresScore(colour)
            return (positionalScore) * colour * -1
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
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEat(newRow, newCol, this.colour)) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
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
            const colDiff = Math.abs(row - kingCol)
            if (rowDiff !== colDiff) {
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

            return {row: newRow, col: newCol}

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
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const newRow = row + currentRow
                const newCol = col + currentCol
                if (((board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol))) && board.canKingMove(newRow, newCol, this.colour)) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    moves.push(move)
                }
            }
            // king and rook has not moved, illegal check later
            if (board.castlingSquaresIsEmpty(this.colour, King.KING_SIDE) && !board.rookHasMoved(this.colour, King.KING_SIDE) && !board.kingHasMoved(this.colour)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 6
                moves.push(new Move(this.cell, new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 7), new Cell(row, 5), board.getPiece(row, 7))}))
            }
            if (board.castlingSquaresIsEmpty(this.colour, King.QUEEN_SIDE) && !board.rookHasMoved(this.colour, King.QUEEN_SIDE) && !board.kingHasMoved(this.colour)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 2
                moves.push(new Move(this.cell, new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 7), new Cell(row, 5), board.getPiece(row, 7))}))
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

            return {row: newRow, col: newCol}

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
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
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
            const colDiff = Math.abs(row - kingCol)
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

            return {row: newRow, col: newCol}

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
            const moves = []
            let newRow = this.cell.row + 1 * this.colour
            let newCol = this.cell.col
            if (board.canMove(newRow, newCol)) {
                const move = new Move(this.cell, new Cell(newRow, newCol),
                    this, undefined, undefined, undefined,
                    newRow === 0 || newRow === 7)
                    moves.push(move)

                newRow = this.cell.row + 2 * this.colour
                if (board.canMove(newRow, newCol) && (newRow === 3 || newRow === 4)) {
                    if (this.colour === Piece.BLACK && this.cell.row === 1) {
                        const move = new Move(this.cell, new Cell(newRow, newCol), this)

                            moves.push(move)

                    } else if (this.colour === Piece.WHITE && this.cell.row === 6) {
                        const move = new Move(this.cell, new Cell(newRow, newCol), this)
                            moves.push(move)
                    }

                }
            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col + 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                    moves.push(move)
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col + 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
                        moves.push(move)
                }

            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col - 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                    moves.push(move)
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col - 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
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
                return {promotion: true, row: newRow, col: newCol}
            }

            return {row: newRow, col: newCol}
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
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
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
            const colDiff = Math.abs(row - kingCol)
            if ((rowDiff !== colDiff) && kingCol !== col && kingRow !== row) {
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

            return {row: newRow, col: newCol}

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
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
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

            return {row: newRow, col: newCol}

        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "r"
        }
    }

        // try {
            const data = message.data
            const boardString = data[0]
            const depth = data[1]
            const moveString = data[2]
            const colour = data[3]
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
                    const nextMove = ab(boardString, depth, moveString, colour)
                    postMessage(nextMove.getMoveString())
                }
            } else {
                const nextMove = ab(boardString, depth, moveString, colour)
                postMessage(nextMove.getMoveString())
            }


        // } catch (e) {
        //     postMessage({isError: true, message:"Error: " + e})
        // }

}
// eslint-disable-next-line no-restricted-globals,no-undef
self.addEventListener("message", test);
