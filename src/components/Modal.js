import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css"


const ModalBody = ({component}) => {
    return (
        <div className="modalBackDrop">
            <div className="modal">
                {component}
            </div>
        </div>
        )
}
const Modal = ({component}) => {
    return (
            <React.Fragment>
                {ReactDOM.createPortal(<ModalBody component={component}/>
                    , document.getElementById('modal')
                )}
            </React.Fragment>
    )
}
export default Modal