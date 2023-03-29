import React, {useState} from "react";
import Game from "./logic/Game";

const ChessContext = React.createContext({
    game: null,
    highlightCell: [],
    setMoves: () => {},
    movePiece: () => {},
    selectedPiece: null,
    promotion: false,
    promotionDetails: {}
});
export const ChessContextProvider = (props) => {
    const [game, setGame] = useState(new Game())
    const [highlightCell, setHighlightCell] = useState([])
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [promotion, setPromotion] = useState(false)
    const [promotionDetails, setPromotionDetails] = useState([])

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
    }

    // get move that was selected by user
    const getMove = (row, col) => {
        for (const move of highlightCell) {
            if (move.newCell.row === row && move.newCell.col === col) {
                return move
            }
        }
    }

    /**
     *
     * @param row new row coordinate
     * @param col new col coordinate
     */
    const movePiece = (row, col) => {
        const result = game.movePiece(selectedPiece, getMove(row, col))
        if (result["promotion"] !== undefined) {
            setPromotion(true)
            setPromotionDetails(result)
        }
        setHighlightCell([])
    }

    return (
        <ChessContext.Provider value={{
            game: game,
            setMoves: setMoves,
            highlightCell: highlightCell,
            movePiece: movePiece,
            selectedPiece: selectedPiece,
            promotion: promotion,
            promotionDetails: promotionDetails
        }}>
            {props.children}
        </ChessContext.Provider>
    )
}
export default ChessContext