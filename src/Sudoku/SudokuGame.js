import React, {useContext, useState} from "react";
import "./Sudoku.css"
import SudokuBoard from "./SudokuBoard";
import sudokuContext from "./SudokuContext";
import Button from "./Button";
import {generateSudoku, solveSudoku} from "./Logic/SudokuLogic"

const SudokuGame = () => {
    const GameBar = () => {
        const [difficulty, setDifficulty] = useState(40)
        const [difficultyError, setDifficultyError] = useState("")
        const sudokuCtx = useContext(sudokuContext)
        const handleGenerate = () => {
            if (25 <= difficulty && difficulty <= 80) {
                const generated = generateSudoku(difficulty)
                sudokuCtx.setFullBoard(generated)
                setDifficultyError("")
            } else {
                setDifficultyError("Must be from 25 to 80")
            }
        }

        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                handleGenerate()
            }
        }

        const handleSolution = () => {
            sudokuCtx.resetBoard()
            const solution = solveSudoku(sudokuCtx.board.getBoardString())
            sudokuCtx.setFullBoard(solution)
        }

        const handleReset = () => {
            sudokuCtx.resetBoard()
        }

        const handleClear = () => {
            sudokuCtx.clearBoard()
        }

        const handleDifficultyChange = (e) => {
            setDifficulty(e.target.value)
        }

        return (
            <div className="sudokuWrapper">
                <div className="sudokuGameBar">
                    Key in number of cells that are filled in, from 25 to 80:
                    <input type="number" value={difficulty} onChange={handleDifficultyChange} className="numberInput" onKeyDown={handleEnter}/>
                    {difficultyError}
                </div>
                <Button onClick={handleGenerate}>
                    Generate puzzle
                </Button>
                <Button onClick={handleSolution}>
                    Show Solution
                </Button>
                <Button onClick={handleReset}>
                    Restart
                </Button>
                <Button onClick={handleClear}>
                    Clear entire board
                </Button>
            </div>
        )
    }
    return (
        <div className="componentWrapper">
            <div className="sudokuWrapper">
                <SudokuBoard />
            </div>
            <GameBar />
        </div>

    )
}
export default SudokuGame
