import React, {useContext} from "react";
import "./SudokuBoard.css"
import sudokuContext from "./SudokuContext";
import SudokuCell from "./SudokuCell";


const SudokuBoard = () => {
    const sudokuCtx = useContext(sudokuContext)

    return (
        <div className="sudokuBoardWrapper">
            {sudokuCtx.board.getBoard().map((row, i) => row.map((cell, j) =>
                <SudokuCell key={i + " " + j} row={i} col={j} cell={cell}/>))}
        </div>
    )
}
export default SudokuBoard
