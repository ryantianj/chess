import React, {useState} from "react";
import Board from "./logic/Board"

const ChessContext = React.createContext({
    board: [],
    highlightCell: [],
    setMoves: () => {},
    movePiece: () => {}
});
export const ChessContextProvider = (props) => {
    const [board, setBoardValue] = useState(new Board())
    const [highlightCell, setHighlightCell] = useState([])
    const [selectedPiece, setSelectedPiece] = useState(null)

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

    const getMove = (row, col) => {
        for (const move of highlightCell) {
            if (move.newCell.row === row && move.newCell.col === col) {
                return move
            }
        }
    }

    const movePiece = (row, col) => {
        board.movePiece(row, col, selectedPiece, getMove(row, col))
        setHighlightCell([])
    }

    return (
        <ChessContext.Provider value={{
            board: board,
            setMoves: setMoves,
            highlightCell: highlightCell,
            movePiece: movePiece
        }}>
            {props.children}
        </ChessContext.Provider>
    )
}
export default ChessContext