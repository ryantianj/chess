import React, {useContext} from "react";
import BoardCell from "./BoardCell";
import "./Board.css"
import ChessContext from "./ChessContext";
import Piece from "./logic/Piece";

const Board = () => {
    const chessCtx = useContext(ChessContext)
    return (
        <div className="chessBoard" style={chessCtx.aiColour === Piece.WHITE ? {transform: "rotateX(180deg) rotateY(180deg)", } :{}}>
            {chessCtx.game.board.getBoard().map((row, i) =>
                row.map((piece, j) =>
                    <BoardCell key={i+" " + j} row={i} col={j} piece={piece}/>
                )
            )}
        </div>
    )
}
export default Board