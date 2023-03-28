import React, {useState} from "react";
import Board from "./Logic/Board";
import {checkSolution} from "./Logic/SudokuLogic";

const SudokuContext = React.createContext({
    board: [],
    editCell: () => {},
    setFullBoard: () => {},
    clearBoard: () => {},
    resetBoard: () => {},
    update: false,
});
export const SudokuContextProvider = (props) => {
    const [board, setBoardValue] = useState(new Board())
    const [update, setUpdate] = useState(false)

    const editCell = (row, col, value) => {
        setBoardValue(prevState => {
            prevState.editCell(row, col, value)
            prevState.correctAllReadOnlyCell()
            return prevState
        })
        const duplicateCells = checkSolution(board.getBoardString(), row, col) // cells to be highlighted
        for (const i in duplicateCells) {
            const row = duplicateCells[i].substring(0, 1)
            const col = duplicateCells[i].substring(2, 3)
            board.getBoard()[row][col].setWrong(true)
        }

        setUpdate(prevState => !prevState)
    }

    const setFullBoard = (boardString, readOnly = true) => {
        const newBoard = new Board(boardString, readOnly)
        setBoardValue(newBoard)
    }

    const clearBoard = () => {
        const newBoard = new Board()
        setBoardValue(newBoard)
    }

    const resetBoard = () => {
        board.clearNonReadOnlyCells()
        setUpdate(prevState => !prevState)
    }

    return (
        <SudokuContext.Provider value={{
            board: board,
            editCell: editCell,
            setFullBoard: setFullBoard,
            clearBoard: clearBoard,
            resetBoard: resetBoard,
            update: update
        }}>
            {props.children}
        </SudokuContext.Provider>
    )
}
export default SudokuContext