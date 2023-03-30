import React, {useState} from "react";
import Game from "./logic/Game";
import Piece from "./logic/Piece";
import ab from "./ai/MiniMax";

const ChessContext = React.createContext({
    game: null,
    highlightCell: [],
    setMoves: () => {},
    movePiece: () => {},
    selectedPiece: null,
    promotion: false,
    promotionDetails: {},
    promote: () => {},
    gameOver: false,
    newGame: () => {},
    undo: () => {}
});
export const ChessContextProvider = (props) => {
    const [game, setGame] = useState(new Game())
    const [highlightCell, setHighlightCell] = useState([])
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [promotion, setPromotion] = useState(false)
    const [promotionDetails, setPromotionDetails] = useState([])
    const [gameOver, isGameOver] = useState(false)

    // display current available moves for a selected piece
    const setMoves = (moves, piece) => {
        setSelectedPiece(piece)
        const newArray = []
        for (let i = 0; i < moves.length; i++) {
            newArray.push(moves[i])
        }
        setHighlightCell(prevState => {
            return newArray
        })
        ab(game)
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

    /**
     *
     * @param row new row coordinate
     * @param col new col coordinate
     */
    const movePiece = (row, col) => {
        const result = game.movePiece(selectedPiece, getMove(row, col))
        const opponentColour = selectedPiece.colour === Piece.BLACK ? Piece.WHITE : Piece.BLACK
        if (game.board.isGameOver(opponentColour)) {
            isGameOver(true)
            setHighlightCell([])
            return
        }
        if (result["promotion"] !== undefined) {
            setPromotion(true)
            setPromotionDetails(result)
        }
        setSelectedPiece(null)
        setHighlightCell([])
    }

    const promote = (piece) => {
        game.board.promotePiece(piece)
        setPromotion(false)
        setPromotionDetails([])
    }

    const newGame = () => {
        const result = window.confirm("New Game, are you sure?")
        if (result) {
            setGame(new Game())
            setHighlightCell([])
            setSelectedPiece(null)
            isGameOver(false)
        }
    }

    const undo = () => {
        if (!gameOver) {
            game.undoMove()
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
            undo: undo
        }}>
            {props.children}
        </ChessContext.Provider>
    )
}
export default ChessContext