import React, {useContext, useState} from "react";
import "./Sudoku.css"
import SudokuBoard from "./SudokuBoard";
import sudokuContext from "./SudokuContext";
import {solveSudoku} from "./Logic/SudokuLogic"
import Button from "./Button";

const SudokuSolver = () => {
    const TestComponent = () => {
        const [isError, setIsError] = useState(false)
        const sudokuCtx = useContext(sudokuContext)

        const handleClick = () => {
            const solution = solveSudoku(sudokuCtx.board.getBoardString())
            if (solution === null) {
                setIsError(true)
            } else {
                setIsError(false)
                sudokuCtx.setFullBoard(solution)
            }
        }

        const handleClear = () => {
            sudokuCtx.clearBoard()
        }

        return (
            <div>
                {isError && <p>Invalid puzzle provided!</p>}
                <Button onClick={handleClick}>
                    Solve
                </Button>
                <Button onClick={handleClear}>
                    Clear
                </Button>
            </div>
        )
    }

    return (
        <div className="componentWrapper">
            <div className="sudokuWrapper">
                <SudokuBoard />
                <TestComponent />
            </div>
        </div>
    )
}
export default SudokuSolver
