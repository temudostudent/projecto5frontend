import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import logo from '../Components/Assets/agileflow-high-resolution-logo-transparent.png'
import { useNavigate } from 'react-router-dom'
import AuthService from "../Components/Service/AuthService"

const ConfirmPendingAccount = () => {
    // Hook for navigation
    const navigate = useNavigate();
    const { search } = useLocation(); // Captura a string de consulta da URL
    const params = new URLSearchParams(search);
    const token = params.get('token'); // Obtém o valor do parâmetro 'token' da string de consulta

    useEffect(() => {
        const fetchUsername = async () => {
            
        };

        fetchUsername();

    }, [token]);


    return (
        <div className='container-initial-generic'>
            <div className='container-index container-fg'>
                <div className='top' style={{ textAlign: 'center' }}>
                    <div className='logo-top' >
                        <img src={logo} alt="Logo da empresa" style={{ width: '50%', height: 'auto' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5em', padding:'35px' }}>Confirm your account</h1>
                    <div className='text-container'>
                        <p>1. Check your inbox for the email address associated with your Agileflow account.</p>
                        <p>2. Look for a message with the subject line "Agileflow Confirmation Request".</p>
                        <p>3. Open the email and click "Confirm your account".</p>
                    </div>
                    <button onClick={() => navigate('/')}>Return</button>
                </div>
            </div>
        </div>
    )
};

export default ConfirmPendingAccount;