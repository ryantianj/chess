import React, {useContext, useEffect} from "react";
import "./MoveBar.css";
import ChessContext from "../ChessContext";
import Move from "./Move";

const MoveBar = () => {
    const chessCtx = useContext(ChessContext)
    // show latest move
    const handleScrollRight = () => {
        const objDiv = document.getElementById("moveBar");
        objDiv.scrollTo({ left: chessCtx.game.board.moves.length * 50, behavior: 'smooth' })
    }

    useEffect(() => {
        handleScrollRight()
    }, [chessCtx.game.board.moves.length])

    return (
        <div className="moveBar" id="moveBar">
            {chessCtx.game.board.moves.map((x, i) => <Move move={x} key={i} idx={i}/>)}
        </div>
    )
}
export default MoveBar
