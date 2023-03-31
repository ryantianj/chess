
export default () => {
    // https://stackoverflow.com/questions/50901954/webworkers-dont-seem-to-be-working-in-production
    // eslint-disable-next-line no-restricted-globals
    let onmessage = async (message) => {
        let nodes = 0
        const ab =  (boardString, depth) => {
            nodes = 0
            const copyBoard = new Board()
            copyBoard.setBoardString(boardString)
            const result = miniMax(copyBoard, depth, -Number.MAX_VALUE, Number.MAX_VALUE, true, Piece.BLACK, Piece.BLACK)
            return result[0] // should be a move
        }

        const evaluate = (board, colour) => { // TODO: improve heursitics, engine elo determined here
            return board.getScore(colour)
        }

        const switchColour = (colour) => {
            return colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
        }

        const miniMax = (board, depth, alpha, beta, isMax, maxPlayer, currentPlayer) => {
            // nodes+=1
            if (depth === 0 || board.isGameOver(currentPlayer).isGameOver) {
                return [null, evaluate(board, maxPlayer)]
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
                        && (this.getPiece(newRow, newCol) instanceof King && this.getPiece(newRow, newCol).colour !== colour)) {
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
                let squares = []
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (!this.isEmpty(row, col) && this.getPiece(row, col).colour !== colour && !(this.getPiece(row, col) instanceof King)) {
                            const piece = this.getPiece(row, col)
                            const moves = piece.getAttack(this)
                            squares = squares.concat(moves)
                        }
                    }
                }
                return squares
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
                    }
                    if (move.isPromotion) { // remove piece, add back pawn
                        this.board[prevRow][prevCol] = new Pawn(piece.colour, piece.cell, piece.moves)
                    }
                    if (move.castle.isCastle) { // king will be undone, need to undo rook
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
                    if (move.piece instanceof King && move.piece.colour === colour) {
                        return true
                    }
                }
                return false
            }

            rookHasMoved = (colour, side) => {
                const row = colour === Piece.BLACK ? 0 : 7
                const col = side === King.KING_SIDE ? 7 : 0
                if (!(this.getPiece(row, col) instanceof Rook)) { // no rook on cell
                    return true
                }
                for (const move of this.moves) {
                    if (move.piece instanceof Rook && move.piece.colour === colour && move.oldCell.row === row && move.oldCell.col === col) {
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
                // console.log(this.castlingSquaresIsEmpty(colour, side) , !this.castlingSquaresUnderAttack(colour, side, attacked)
                //     , !this.rookHasMoved(colour, side) , !this.kingHasMoved(colour))
                return this.castlingSquaresIsEmpty(colour, side) && !this.castlingSquaresUnderAttack(colour, side, attacked)
                    && !this.rookHasMoved(colour, side) && !this.kingHasMoved(colour)
            }

            promotePiece = (piece) => {
                const row = piece.cell.row
                const col = piece.cell.col
                this.board[row][col] = piece
            }

            // returns if colour is under check
            isCheck = (colour) => {
                const attacked = this.getAttackingSquares(colour)
                for (const move of attacked) {
                    if (this.getPiece(move.newCell.row, move.newCell.col) instanceof King
                        && this.getPiece(move.newCell.row, move.newCell.col).colour === colour) {
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
                    return {isGameOver: true, message: player + " wins by checkmate"}
                } else if (!underCheck && allMoves.length <= 0) {
                    return {isGameOver: true, message: "Draw by stalemate"}
                } else if (this.isRepeatPosition(8)) {
                    return {isGameOver: true, message: "Draw by threefold repetition"}
                }
                return {isGameOver: false, message: ""}
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
             * used for minimax heuristics
             * @param colour colour making the next move
             * @return {number} score of position
             */
            getScore = (colour) => {
                let whiteScore = 0
                let blackScore = 0
                let materialScore = 0
                const opponentColour = colour === Piece.WHITE ? Piece.BLACK : Piece.WHITE
                for (let row = 0; row < 8; row ++) {
                    for (let col = 0; col < 8; col ++) {
                        const piece = this.board[row][col]
                        if (piece instanceof Piece && piece.colour === colour) {
                            materialScore += piece.points
                        }
                        if (piece instanceof Piece && piece.colour !== colour) {
                            materialScore -= piece.points
                        }
                    }
                }
                const attackScore = this.getAttackingSquares(opponentColour).length
                return materialScore * 0.9
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

        }
        class Piece {
            static WHITE = -1
            static BLACK = 1
            isAlive = true
            constructor(colour, cell, moves= []) {
                this.colour = colour // white or black
                this.cell = cell
                this.moves = moves // moves made by the piece so far, [[startRow, startCol, endRow, endCol]], most recent at the back (can pop())
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
            points = 3
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
            points = 0
            constructor(colour, cell, moves) {
                super(colour, cell, moves)

            }

            /**
             * Returns valid moves of a piece (move object)
             * @param board chess board, object
             */
            getMoves = (board) => {
                const moves = []
                const attacked = board.getAttackingSquares(this.colour)
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

            points = 3
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
            points = 1
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
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                    newRow = this.cell.row + 2 * this.colour
                    if (board.canMove(newRow, newCol) && this.moves.length <= 0) {
                        const move = new Move(this.cell, new Cell(newRow, newCol), this)
                        if (!board.willCheck(this, move)) {
                            moves.push(move)
                        }
                    }
                }
                newRow = this.cell.row + 1 * this.colour
                newCol = this.cell.col + 1
                if (board.canEat(newRow, newCol, this.colour)) {
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }
                // en passant
                if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                    const prevMove = board.moves.slice(-1)[0]
                    if (prevMove.piece instanceof Pawn && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col + 1
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
                    const move = new Move(this.cell, new Cell(newRow, newCol), this)
                    if (!board.willCheck(this, move)) {
                        moves.push(move)
                    }
                }
                // en passant
                if (board.canMove(newRow, newCol) && board.moves.length > 0) {
                    const prevMove = board.moves.slice(-1)[0]
                    if (prevMove.piece instanceof Pawn && prevMove.newCell.row === this.cell.row && prevMove.newCell.col === this.cell.col - 1
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

                // promotion
                if (newRow === 0 || newRow === 7) {
                    move.isPromotion = true
                    this.moves.push(move)
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
            points = 9
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
            points = 5
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
        const nextMove = ab(data[0], data[1])
        postMessage(nextMove.getMoveString())
    }
}