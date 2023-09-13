import React, { useState } from "react";
import './style/Modal.css'

// A reusable Modal taking a text as the props
const Modal = ({ text }) => {
    const [modal, setModal] = useState(true)

    const onCloseBtnClicked = () => {
        setModal(!modal)
    }
    // text returns is null, if its null then we hide modal
    return (
        <div className={`modal ${modal && text != null ? '': 'hide-modal'}`}>
            <div className="modal-content">
                <p>
                    {text}
                </p>
                <button onClick={onCloseBtnClicked} className="close-modal">X</button>
            </div>
        </div>
    )
}
export default Modal