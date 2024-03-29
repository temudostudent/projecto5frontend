import React, { useEffect, useState } from 'react'
import { useActionsStore } from '../../Stores/ActionStore'

const Modal = (props) => {

    // State variables and functions from the action store
    const showModal = useActionsStore((state) => state.showModal);
    const updateShowModal = useActionsStore((state) => state.updateShowModal);

    // Destructuring props
    const { title, inputs, buttonText } = props;

    // Function to close the modal
    const closeModal = () => {
        updateShowModal(false);
    }

    // Function to create input elements based on input configuration
    const createInput = (input) => {
        const { type, name, placeholder, options } = input;

        if (type === 'select') {
            // If input type is select, render a select element
            return (
                <select name={name} required={input.required}>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
            );
        } else {
            // Otherwise, render an input element
            return <input type={type} name={name} placeholder={placeholder} required={input.required} />;
        }
    }


    return (
        <>
            {showModal && (
                // Render the modal only if showModal is true
                <div className="modal">
                    <div className="modal-content">
                        {/* Close button */}
                        <span className="close" onClick={closeModal}>&times;</span>
                        {/* Modal title */}
                        <h2>{title}</h2>
                        {/* Form with input elements */}
                        <form>
                            {inputs.map((input, index) => (
                                <div key={index}>
                                    {createInput(input)}
                                </div>
                            ))}
                        </form>
                        {/* Button */}
                        <button>{buttonText}</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal; 