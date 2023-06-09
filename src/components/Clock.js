import React, {useContext, useEffect, useState} from "react";
import "./Clock.css"
import ChessContext from "../Chess/ChessContext";

const Clock = ({colour}) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const chessCtx = useContext(ChessContext)

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 1), 1000)
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time])

    useEffect(() => {
        startAndStop(chessCtx.game.turnColour === colour && chessCtx.game.board.moves.length >0)
    }, [chessCtx.game.turnColour])

    useEffect(() => {
        reset()
    }, [chessCtx.game])

    useEffect(() => {
        if (chessCtx.gameOver.isGameOver) {
            setIsRunning(false)
        }
    }, [chessCtx.gameOver.isGameOver])

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    const startAndStop = (trigger) => {
        setIsRunning(trigger);
    };

    // Method to reset timer back to 0
    const reset = () => {
        setTime(0);
    };
    return (
        <div>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
        </div>
    )
}
export default Clock
