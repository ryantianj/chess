import React, {useContext, useState} from "react";
import BoardCell from "./BoardCell";
import "./Board.css"
import ChessContext from "./ChessContext";

const Board = () => {
    const chessCtx = useContext(ChessContext)
    return (
        <div className="chessBoard">
            {chessCtx.game.board.getBoard().map((row, i) =>
                row.map((piece, j) =>
                    <BoardCell key={i+" " + j} row={i} col={j} piece={piece}/>
                )
            )}
        </div>
    )
}
export default Board