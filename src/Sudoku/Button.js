import React from "react";
import "./Button.css"

const Button = ({onClick, children, style}) => {
    return (
        <button style={style} className="button" onClick={onClick}>
            {children}
        </button>
    )
}
export default Button
