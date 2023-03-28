import React, {useContext, useEffect, useState} from "react";
import "./SudokuBoard.css"
import sudokuContext from "./SudokuContext";

const SudokuCell = ({row, col, cell}) => {
    const [value, setValue] = useState(cell.getValue())
    const sudokuCtx = useContext(sudokuContext)

    const handleInputChange = (e) => {
        const inputValue = e.target.value
        if (1 <= inputValue && inputValue <= 9) {
            sudokuCtx.editCell(row, col, inputValue.toString())
            setValue(inputValue)
        }
        if (inputValue === "") {
            setValue(inputValue)
            sudokuCtx.editCell(row, col, ".")
        }

    }

    useEffect(() => {
        if (cell.getValue() === ".") {
            setValue("")
        } else {
            setValue(cell.getValue())
        }

    }, [cell])

    useEffect(() => {
        if (cell.getIsWrong()) {
            setValue(cell.getValue())
        }
    }, [cell, sudokuCtx.update])

    const getCSSClass = () => {
        // rows 2, 5 have bottom border, cols 2, 5 have right border
        let currentString = 'sudokuCell'
        if (row === 2 || row === 5) {
            currentString += ' sudokuCellBottom'
        }
        if (col === 2 || col === 5) {
            currentString += ' sudokuCellRight'
        }
        return currentString
    }

    const getCSSClassInput = () => {
        if (sudokuCtx.board.getCell(row, col).getIsWrong() && !sudokuCtx.board.getCell(row, col).getReadOnly()) {
            return "redFont sudokuCellInput"
        }
        if (!sudokuCtx.board.getCell(row, col).getReadOnly()) {
            return "greenFont sudokuCellInput"
        }

        return "sudokuCellInput"
    }

    return (
        <div className={getCSSClass()}>
            <input type="number" className={getCSSClassInput()} onChange={handleInputChange} value={value}
            readOnly={sudokuCtx.board.getCell(row, col).getReadOnly()}/>
        </div>
    )
}
export default SudokuCell