import React from "react";
import "./GameOverModal.css"

const GameOverModal = ({message, closeModal}) => {
    return (
        <div className="gameOverModal">
            {message}
            <button onClick={closeModal}> close </button>
        </div>
    )
}
export default GameOverModal
