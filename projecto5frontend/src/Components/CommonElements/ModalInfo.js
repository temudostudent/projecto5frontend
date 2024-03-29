import React from 'react';
import { useActionsStore } from '../../Stores/ActionStore';

const ModalInfo = (props) => {
    // State variables and functions from the action store
    const showModal = useActionsStore((state) => state.showModal);
    const updateShowModal = useActionsStore((state) => state.updateShowModal);
    // Destructuring props
    const { title, inputs } = props;

    // Function to close the modal
    const closeModal = () => {
        updateShowModal(false);
    }

    // Function to create input elements based on input configuration
    const createInput = (input) => {
        const { label, name, value } = input;
        return (
            // Render label and value inside a div
            <div key={name} className='info-container'>
                <label>{label}</label>
                <h4>{value}</h4>
            </div>
        );
    }

    

    return (
        <>
            {showModal && (
                // Render the modal only if showModal is true
                <div className="modal">
                    <div className="modalInfo-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{title}</h2>
                        <div className='modal-info-container'>
                            {inputs.map((input, index) => (
                                <div key={index}>
                                    {createInput(input)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalInfo;