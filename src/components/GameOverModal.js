import React from "react";
import "./GameOverModal.css"

const GameOverModal = ({colour, closeModal}) => {
    return (
        <div className="gameOverModal">
            {colour} wins!
            <button onClick={closeModal}> close </button>
        </div>
    )
}
export default GameOverModal
