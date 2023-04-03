let moves = 0
const test = async (message) => {
   // https://chess.stackexchange.com/questions/40362/my-transposition-tables-implementation-slows-down-alpha-beta-pruning
    // https://github.com/maksimKorzh/chess_programming/blob/master/src/negamax/tutorials/alpha-beta_quiescence_search/chess.c
    // console.log("working")
    let nodes = 0
    const mem = new Map()
    console.log("mem", mem.size, moves)
    moves++
    const ab =  (boardString, depth, moveString) => {
        nodes = 0
        const copyBoard = new Board()
        copyBoard.setBoardString(boardString)
        const start = performance.now()
        const moves = moveString.map(x => Move.parseMove(copyBoard, x))
        copyBoard.moves = moves
        const result = miniMax(copyBoard, depth, -Number.MAX_VALUE, Number.MAX_VALUE, true, Piece.BLACK, Piece.BLACK)
        // const result = rootNegaMax(depth, copyBoard, Piece.BLACK, Piece.BLACK)
        const end = performance.now()
        console.log(nodes, end - start)
        console.log("Score", result[1])
        return result[0] // should be a move
    }

    const evaluate = (board, colour) => { // TODO: improve heursitics, engine elo determined here
        return board.getScore(colour)
    }

    const switchColour = (colour) => {
        return colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
    }

    const sortMoves = (a, b) => {
        if (a.ate !== null && b.ate !== null) {
            return b.ate.points - a.ate.points
        } else if (a.ate !== null) {
            return -1
        } else if (b.ate !== null) {
            return 1
        }
        return 0
    }

    const miniMax = (board, depth, alpha, beta, isMax, maxPlayer, currentPlayer) => {
        // nodes++
        if (depth === 0) {
            // const result = evaluate(board, maxPlayer)
            const result = maxPlayer * -1 * quiesce(alpha, beta, board, currentPlayer, 1)

            return [null, result] // for even depth no need -1, for odd , -1
        }
        const testGameOver = board.isGameOver(currentPlayer)
        if (testGameOver.isGameOver && currentPlayer === maxPlayer) {
            return [null, -Number.MAX_VALUE]
        }
        if (testGameOver.isGameOver && currentPlayer !== maxPlayer) {
            return [null, Number.MAX_VALUE]
        }
        const moves = testGameOver.allMoves
        moves.sort(sortMovesQuiesce)
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

    const sortMovesQuiesce = (a, b) => {
        if (a.ate !== null && b.ate !== null) {
            const aScore = a.piece.points - a.ate.points
            const bScore = b.piece.points - b.ate.points
            return aScore < bScore ? 1: -1
        } else if (a.ate !== null) {
            return -1
        } else if (b.ate !== null) {
            return 1
        }
        return 0
    }

    const quiesce = (alpha, beta, board, colour, depth) => {
        // const evaluation = evaluate(board, colour)
        let evaluation
        const boardHash = board.getBoardHash() + colour.toString() + depth.toString()
        if (mem.get(boardHash) !== undefined) {
            nodes++
            evaluation = mem.get(boardHash)
        } else {
            evaluation = evaluate(board, colour)
            mem.set(boardHash, evaluation)
        }

        if (depth === 0) {
            return evaluation
        }
        if (evaluation >= beta) {
            return beta
        }

        alpha = Math.max(alpha, evaluation)
        const moves = board.getAllMoves(colour)
        moves.sort(sortMovesQuiesce)
        for (const move of moves) {
            if (move.ate !== null && move.ate.points > move.piece.points) {
                board.movePiece(move.piece, move)
                let score = -quiesce(-beta, -alpha, board, switchColour(colour), depth - 1)
                board.undoMove()
                if (score >= beta) {
                    return beta
                }
                if (score > alpha) {
                    alpha = score
                }
            }
        }
        return alpha
    }

    const negaMax = (depth, board, colour, maxColour) => {
        if (depth === 0) {
            return evaluate(board, maxColour)
        }
        const testGameOver = board.isGameOver(colour).isGameOver
        if (testGameOver && colour === maxColour) {
            return -Number.MAX_VALUE
        }
        if (testGameOver && colour !== maxColour) {
            return Number.MAX_VALUE
        }
        let max = -Number.MAX_VALUE
        const moves = board.getAllMoves(colour)
        for (const move of moves) {
            board.movePiece(move.piece, move)
            const currentEval = -negaMax(depth - 1, board, switchColour(colour), maxColour)
            if (currentEval > max) {
                max = currentEval
            }
            board.undoMove()
        }
        return max
    }
    const rootNegaMax = (depth, board, colour, maxColour) => {
        const rootMoves = board.getAllMoves(maxColour)
        let max = -Number.MAX_VALUE
        const randomIndex = Math.floor(Math.random() * (rootMoves.length - 1))
        let bestMove = rootMoves.length > 0 ? rootMoves[randomIndex] : null
        for (const move of rootMoves) {
            board.movePiece(move.piece, move)
            const score = negaMax(depth, board, colour, maxColour)
            if (score > max) {
                max = score
                bestMove = move
            }
            board.undoMove()
        }
        return bestMove

    }
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

        deepCopyBoard = () => {

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

        clonePiece = (piece) => {
            if (piece instanceof Pawn) {
                return new Pawn(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            } else if (piece instanceof Bishop) {
                return new Bishop(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            } else if (piece instanceof King) {
                return new King(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            } else if (piece instanceof Knight) {
                return new Knight(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            } else if (piece instanceof Queen) {
                return new Queen(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            } else if (piece instanceof Rook) {
                return new Rook(piece.colour, new Cell(piece.cell.row, piece.cell.col))
            }
            return null
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

        canEatDefend = (row, col) => {
            return !this.isOutSide(row, col) && !this.isEmpty(row, col)
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
        /**
         * Returns the squares, marked by moves, that are under attack by the opposing colour
         * @param colour
         * @return {*[]}
         */
        getAttackingSquares = (colour) => { // colour is for piece being attacked
            const squares = []
            const defense = []
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (!this.isEmpty(row, col)) {
                        const getPc = this.getPiece(row, col)
                        if (getPc.colour !== colour && !(getPc.name === Piece.KING)) {
                            const moves = getPc.getAttack(this)
                            squares.push.apply(squares, moves) // better performance
                        }
                    // else if (getPc.colour === colour && !(getPc instanceof King)) {
                    //         const moves = getPc.getAttack(this)
                    //         defense.push.apply(defense, moves) // TODO: may remove, performance
                    //     }
                    }
                }
            }
            return [squares, defense]
        }

        movePiece = (piece, move) => {
            const result =  this.board[move.oldCell.row][move.oldCell.col].movePiece(move, this)
            this.moves.push(move)
            return result
        }

        undoMove = () => {
            if (this.moves.length > 0) {
                const move = this.moves.pop()
                const prevRow = move.oldCell.row
                const prevCol = move.oldCell.col
                const piece = this.board[move.newCell.row][move.newCell.col]
                this.board[prevRow][prevCol] = piece
                piece.moves.pop()
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
        castlingSquaresUnderAttack = (colour, side, attacked) => { // includes the king himself
            const row = colour === Piece.BLACK ? 0 : 7
            const cols = side === King.KING_SIDE ? [4,5,6] : [1,2,3,4]
            for (const col of cols) {
                for (const move of attacked) {
                    if (move.newCell.row === row && move.newCell.col === col) {
                        return true
                    }
                }
            }
            return false
        }

        canCastle = (colour, side, attacked) => {
            return this.castlingSquaresIsEmpty(colour, side) && !this.castlingSquaresUnderAttack(colour, side, attacked)
                && !this.rookHasMoved(colour, side) && !this.kingHasMoved(colour)
        }

        promotePiece = (piece) => {
            const row = piece.cell.row
            const col = piece.cell.col
            this.board[row][col] = piece
        }

        // returns if colour is under check
        isCheck = (colour, attackArray = null) => {
            const attacked = attackArray === null ? this.getAttackingSquares(colour)[0] : attackArray
            for (const move of attacked) {
                const piece = this.getPiece(move.newCell.row, move.newCell.col)
                if (piece !== null && piece.name === Piece.KING
                    && piece.colour === colour) {
                    return true
                }
            }
            return false
        }

        /**
         * This functions determines if a move will result in your own King being under check (illegal move)
         * @param piece
         * @param move
         */
        willCheck = (piece, move) => {
            this.movePiece(piece, move)
            if (this.isCheck(piece.colour)) {
                this.undoMove()
                return true
            }
            this.undoMove()
            return false
        }
        getAllMoves = (colour) => {
            let moves = []
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.board[row][col]
                    if (piece !== null && this.getPiece(row, col).colour === colour) {
                        moves = moves.concat(this.getPiece(row, col).getMoves(this))
                    }
                }
            }
            return moves
        }

        /**
         * Defined by: same position occurs thrice for threefold repetition
         * @param times
         * @return {boolean}
         */
        isRepeatPosition = (numMoves) => {
            const lengthCheck = numMoves
            if (this.moves.length >= lengthCheck) {
                const getLastNMoves = this.moves.slice(-lengthCheck)
                let firstMove = getLastNMoves[0]
                let secondMove = getLastNMoves[1]
                for (let i = 2; i < lengthCheck; i+=4) {
                    const current = getLastNMoves[i]
                    const currentTwo = getLastNMoves[i+1]
                    if (!(current.newCell.row === firstMove.oldCell.row && current.newCell.col === firstMove.oldCell.col && firstMove.piece === current.piece)) {
                        return false
                    }
                    if (!(currentTwo.newCell.row === secondMove.oldCell.row && currentTwo.newCell.col === secondMove.oldCell.col && secondMove.piece === currentTwo.piece)) {
                        return false
                    }
                }
                return true
            }
            return false
        }

        /**
         * Checks if game is over for colour, means other colour wins
         * @param colour
         * @return {{isGameOver: boolean, message: string}}
         */
        isGameOver = (colour) => {
            const allMoves = this.getAllMoves(colour)
            const underCheck = this.isCheck(colour)
            const player = colour === Piece.BLACK ? "White" : "Black"
            if (underCheck && allMoves.length <= 0) {
                return {isGameOver: true, message: player + " wins by checkmate", allMoves: allMoves}
            } else if (!underCheck && allMoves.length <= 0) {
                return {isGameOver: false, message: "Draw by stalemate", allMoves: allMoves}
            } else if (this.isRepeatPosition(8)) {
                return {isGameOver: false, message: "Draw by threefold repetition",allMoves: allMoves}
            }
            return {isGameOver: false, message: "", allMoves: allMoves}
        }

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
                        if (piece.name === Piece.PAWN && piece.colour === Piece.WHITE) {
                            if (!this.isEmpty(row + 1, col) && this.getPiece(row + 1, col).name === Piece.PAWN && piece.colour === Piece.WHITE) {
                                score -= 20
                            }
                        } else if (piece.name === Piece.PAWN && piece.colour !== Piece.WHITE) {
                            if (!this.isEmpty(row - 1, col) && this.getPiece(row - 1, col).name === Piece.PAWN && piece.colour !== Piece.WHITE) {
                                score += 20
                            }
                        }
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
            const total = score + materialScore
            // if (this.board[3][4] instanceof Pawn && this.board[3][4].colour === Piece.WHITE
            // && this.board) {
            //     console.log(this.board)
            // }
            return total
        }

        /**
         * used for minimax heuristics
         * @param colour colour making the next move
         * @return {number} score of position
         */
        getScore = (colour) => {
            const opponentColour = colour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
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
            return moves.filter(move => {
                return move.ate !== null && move.ate.colour !== colour
            }).map(x => x.ate)
        }

        undoMove = () => {
            const isUndo = this.board.undoMove()
            if (isUndo) {
                this.turnColour = this.turnColour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
            }
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
                {isCastle: false}, // TODO : handle
                null,
                data.isPromotion
            )
            if (data.isPromotion) {
                board.promotePiece(new Queen(board.getPiece(data.oldCellRow, data.oldCellCol).colour,
                    board.getPiece(data.oldCellRow, data.oldCellCol).cell))
            }
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
        isAlive = true
        constructor(colour, cell, moves= []) {
            this.colour = colour // white or black
            this.cell = cell
            this.moves = moves // moves made by the piece so far, [[startRow, startCol, endRow, endCol]], most recent at the back (can pop())
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
    class Player {
        // player has colour
        constructor(colour) {
            this.colour = colour
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
        constructor(colour, cell, moves) {
            super(colour, cell, moves)
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
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        getAttack = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                    moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
                    if (board.canEatDefend(newRow, newCol)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
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
            this.moves.push(move)

            return {row: newRow, col: newCol}

        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "b"
        }
    }
    class King extends Piece {
        directions = [[1,1], [-1,-1], [1,-1],[-1,1],[0,1], [1,0], [0,-1],[-1,0]]
        static KING_SIDE = 'king'
        static QUEEN_SIDE = 'queen'
        name = Piece.KING
        points = 20000

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
        constructor(colour, cell, moves) {
            super(colour, cell, moves)

        }

        /**
         * Returns valid moves of a piece (move object)
         * @param board chess board, object
         */
        getMoves = (board) => {
            const moves = []
            const attacked = board.getAttackingSquares(this.colour)[0]
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const newRow = row + currentRow
                const newCol = col + currentCol
                if (((board.canEat(newRow, newCol, this.colour) || board.canMove(newRow, newCol))) && board.canKingMove(newRow, newCol, this.colour)) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }
            }

            const filterAttacked = moves.filter(move => { // king cannot move to squares under attack by enemy / pieces that are defended
                for (const attack of attacked) {
                    if (move.newCell.row === attack.newCell.row && move.newCell.col === attack.newCell.col) {
                        return false
                    }
                }
                return true
            })
            // castling move: if king has not moved + rook on respective square has not moved done
            // + squares in between and king not attacked  + squares in between are empty
            if (board.canCastle(this.colour, King.KING_SIDE, attacked)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 6
                filterAttacked.push(new Move(this.cell, new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 7), new Cell(row, 5), board.getPiece(row, 7))}))
            }
            if (board.canCastle(this.colour, King.QUEEN_SIDE, attacked)) {
                const row = this.colour === Piece.BLACK ? 0 : 7
                const col = 2
                filterAttacked.push(new Move(this.cell, new Cell(row, col), this, false,
                    {isCastle: true, rook: new Move(new Cell(row, 0), new Cell(row, 3), board.getPiece(row, 0))}))
            }
            return filterAttacked
        }
        getAttack = (board) => {
            return this.getMoves(board)
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
            this.moves.push(move)

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
        constructor(colour, cell, moves) {
            super(colour, cell, moves)

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
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }
            }
            return moves
        }
        getAttack = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const row = direction[0]
                const col = direction[1]
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const newRow = row + currentRow
                const newCol = col + currentCol
                if (board.canEatDefend(newRow, newCol) || board.canMove(newRow, newCol)) {
                    moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
                }
            }
            return moves
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
            this.moves.push(move)

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
        blackScore = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10,-40,-40, 10, 10,  5],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [0,  0,  0,  0,  0,  0,  0,  0],
        ]
        constructor(colour, cell, moves) {
            super(colour, cell, moves)

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
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
                newRow = this.cell.row + 2 * this.colour
                if (board.canMove(newRow, newCol) && this.moves.length <= 0) {
                    if (this.colour === Piece.BLACK && this.cell.row === 1) {
                        const move = new Move(this.cell, new Cell(newRow, newCol), this)
                        if (!board.willCheck(this, move)) {
                            moves.push(move)
                        }
                    } else if (this.colour === Piece.WHITE && this.cell.row === 6) {
                        const move = new Move(this.cell, new Cell(newRow, newCol), this)
                        if (!board.willCheck(this, move)) {
                            moves.push(move)
                        }
                    }

                }
            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col + 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col + 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }

            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col - 1
            if (board.canEat(newRow, newCol, this.colour)) {
                const move = new Move(this.cell, new Cell(newRow, newCol), this , undefined, undefined, board.getPiece(newRow, newCol),
                    newRow === 0 || newRow === 7)
                if (!board.willCheck(this, move)) {
                    moves.push(move)
                }
            }
            // en passant
            if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                const prevMove = board.moves.slice(-1)[0]
                if (prevMove.piece.name === Piece.PAWN && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col - 1
                    && Math.abs(prevMove.newCell.row - prevMove.oldCell.row) === 2) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this, true)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }

            }
            return moves
        }
        getAttack = (board) => {
            const moves = []
            let newRow = this.cell.row + 1 * this.colour
            let newCol = this.cell.col + 1
            if (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
            }
            newRow = this.cell.row + 1 * this.colour
            newCol = this.cell.col - 1
            if (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
            }
            return moves
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


            this.moves.push(move)
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
        constructor(colour, cell, moves) {
            super(colour, cell, moves)

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
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        getAttack = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                    moves.push(new Move(this.cell, new Cell(newRow, newCol), this))
                    if (board.canEatDefend(newRow, newCol)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
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
            this.moves.push(move)

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
            [0,  0,  4,  5,  5,  4,  0,  0],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0],
        ]
        constructor(colour, cell, moves) {
            super(colour, cell, moves)

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
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                    if (board.canEat(newRow, newCol, this.colour)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
        }
        getAttack = (board) => {
            const moves = []
            for (const direction of this.directions) {
                const currentRow = this.cell.row
                const currentCol = this.cell.col
                const row = direction[0]
                const col = direction[1]
                let newRow = row + currentRow
                let newCol = col + currentCol
                while (board.canMove(newRow, newCol) || board.canEatDefend(newRow, newCol)) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    moves.push(move)
                    if (board.canEatDefend(newRow, newCol)) {
                        break
                    }
                    newRow +=row
                    newCol +=col
                }
            }
            return moves
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
            this.moves.push(move)

            return {row: newRow, col: newCol}

        }

        getString = () => {
            const colourString = this.colour === Piece.WHITE ? "w" : "b"
            return colourString + "r"
        }
    }


        const data = message.data
        const nextMove = ab(data[0], data[1], data[2])

        postMessage(nextMove.getMoveString())



}
// eslint-disable-next-line no-restricted-globals,no-undef
self.addEventListener("message", test);
