import React, {useEffect, useState} from "react";
import Game from "./logic/Game";
import Piece from "./logic/Piece";
import Worker from "./ai/worker.worker";
import Move from "./logic/Move";
import Cell from "./logic/Cell";
import Bishop from "./logic/Pieces/Bishop";
import King from "./logic/Pieces/King";
import Knight from "./logic/Pieces/Knight";
import Pawn from "./logic/Pieces/Pawn";
import Queen from "./logic/Pieces/Queen";
import Rook from "./logic/Pieces/Rook";

const myWorker = new Worker()

const ChessContext = React.createContext({
    game: null,
    highlightCell: [],
    setMoves: () => {},
    movePiece: () => {},
    selectedPiece: null,
    promotion: false,
    promotionDetails: {},
    promote: () => {},
    gameOver: {isGameOver: false},
    newGame: () => {},
    undo: () => {},
    toggleEngine: () => {},
    ai: false,
    engineMove: () => {},
    aiColour: Piece.BLACK,
    setAiColour: () => {},
    setDepth: () => {},
    depth: 3
});


export const ChessContextProvider = (props) => {
    const [game, setGame] = useState(new Game())
    const [highlightCell, setHighlightCell] = useState([])
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [promotion, setPromotion] = useState(false)
    const [promotionDetails, setPromotionDetails] = useState([])
    const [gameOver, isGameOver] = useState({isGameOver: false})
    const [ai, isAI] = useState(false)
    const [aiColour, setColour] = useState(Piece.BLACK)
    const [depth, setEngineDepth] = useState(2)

    const setDepth = (depth) => {
        setEngineDepth(depth)
    }

    const setAiColour = (colour) => {
        setColour(colour)
    }

    const toggleEngine = () => {
        if (!ai) {
            if (game.turnColour === aiColour) { // white ai to start
                const moveString = game.board.moves.map(x => Move.getMoveString(x))
                myWorker.postMessage([game.board.getBoardString(), depth, moveString, aiColour])
            }
            alert("Engine on")
        } else {
            alert("Engine off")
        }
        isAI(prevState =>
        {
            return !prevState
        })
    }

    // display current available moves for a selected piece
    const setMoves = (moves, piece) => {
        if (gameOver.isGameOver) {
            return;
        }
        setSelectedPiece(piece)
        const newArray = []
        for (let i = 0; i < moves.length; i++) {
            newArray.push(moves[i])
        }
        setHighlightCell(prevState => {
            return newArray
        })
    }

    // get move that was selected by user
    const getMove = (row, col) => {
        for (const move of highlightCell) {
            if (move.newCell.row === row && move.newCell.col === col) {
                return move
            }
        }
        return null
    }

    const engineMove = (move) => {
        if (gameOver.isGameOver) {
            return;
        }
        const result = game.movePiece(move.piece, move)
        const opponentColour = move.piece.colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
        const checkGameOver = game.board.isGameOver(opponentColour)
        if (checkGameOver.isGameOver) {
            isGameOver(checkGameOver)
            setHighlightCell([])
            return
        }
        if (result["promotion"] !== undefined) { // TODO: handle bot promotion
            setPromotion(true)
            setPromotionDetails(result)
        }
        setSelectedPiece(null)
        setHighlightCell([])
    }

    /**
     *
     * @param row new row coordinate
     * @param col new col coordinate
     */
    const movePiece = (row, col) => {
        if (gameOver.isGameOver) {
            return;
        }
        const result = game.movePiece(selectedPiece, getMove(row, col))
        const opponentColour = selectedPiece.colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
        const checkGameOver = game.board.isGameOver(opponentColour)
        if (checkGameOver.isGameOver) {
            isGameOver(checkGameOver)
            setHighlightCell([])
            return
        }
        if (result["promotion"] !== undefined) {
            setPromotion(true)
            setPromotionDetails(result)
        } else {
            setHighlightCell([])
            setSelectedPiece(null)
            if (game.turnColour === aiColour) {
                if (ai) {
                    const moveString = game.board.moves.map(x => Move.getMoveString(x))
                    myWorker.postMessage([game.board.getBoardString(), depth, moveString, aiColour])

                }
            }
        }
    }

    useEffect(() => {
        myWorker.onerror = (ev) => {
            alert("Engine error: " + ev.message)
        }
        myWorker.onmessage = (message) => {
             const parsePiece = (pieceString, row, col) => {
                if (pieceString === null) {
                    return null
                }
                const pieceColour = pieceString.slice(0, 1)
                const actualColour = pieceColour === "w" ? Piece.WHITE : Piece.BLACK
                const piece = pieceString.slice(1, 2)
                if (piece === "b") {
                    return new Bishop(actualColour, new Cell(row, col))
                } else if (piece === 'k') {
                    return new King(actualColour, new Cell(row, col))
                } else if (piece === 'n') {
                    return new Knight(actualColour, new Cell(row, col))
                } else if (piece === 'p') {
                    return new Pawn(actualColour, new Cell(row, col))
                } else if (piece === 'q') {
                    return new Queen(actualColour, new Cell(row, col))
                } else if (piece === 'r') {
                    return new Rook(actualColour, new Cell(row, col))
                } else {
                    return null
                }
            }
            if (message) {
                const data = message.data
                if (data.isError) {
                    alert("Engine error: " + data.message)
                } else {
                    const parseMove = Move.parseMove(game, data)
                    engineMove(parseMove)
                }
            }
        }
    }, [engineMove, game.board])

    const promote = (piece) => {
        game.board.promotePiece(piece)
        setPromotion(false)
        setPromotionDetails([])
        setHighlightCell([])
        setSelectedPiece(null)
        if (ai && game.turnColour === aiColour) {
            const moveString = game.board.moves.map(x => Move.getMoveString(x))
            myWorker.postMessage([game.board.getBoardString(), depth, moveString, aiColour])
        }
    }

    const newGame = () => {
        const result = window.confirm("New Game, are you sure?")
        if (result) {
            setGame(new Game())
            setHighlightCell([])
            setSelectedPiece(null)
            isGameOver({isGameOver: false})
            isAI(false)
            myWorker.postMessage({newGame: true})
        }
    }

    const undo = () => {
        if (!gameOver.isGameOver) {
            if (ai) {
                if (game.board.moves.length > 1 && game.turnColour !== aiColour) {
                    game.undoMove()
                    game.undoMove()
                    myWorker.postMessage({undo: true})
                }
            } else {
                game.undoMove()
            }
            setHighlightCell([])
        }
    }

    return (
        <ChessContext.Provider value={{
            game: game,
            setMoves: setMoves,
            highlightCell: highlightCell,
            movePiece: movePiece,
            selectedPiece: selectedPiece,
            promotion: promotion,
            promotionDetails: promotionDetails,
            promote: promote,
            gameOver: gameOver,
            newGame: newGame,
            undo: undo,
            toggleEngine: toggleEngine,
            ai: ai,
            engineMove: engineMove,
            aiColour:aiColour,
            setAiColour: setAiColour,
            depth: depth,
            setDepth: setDepth
        }}>
            {props.children}
        </ChessContext.Provider>
    )
}
export default ChessContext