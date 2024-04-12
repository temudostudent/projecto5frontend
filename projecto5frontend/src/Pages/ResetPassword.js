import React from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../Components/Assets/agileflow-high-resolution-logo-transparent.png'
import { useNavigate } from 'react-router-dom'
import AuthService from "../Components/Service/AuthService"
import TokenService from "../Components/Service/TokenService"
import { useEffect, useState } from 'react';

const ResetPassword = () => {
    // Hook for navigation
    const navigate = useNavigate();
    const [validToken, setValidToken] = useState(false);
    const { search } = useLocation(); // Captura a string de consulta da URL
    const params = new URLSearchParams(search);
    const token = params.get('token'); // Obtém o valor do parâmetro 'token' da string de consulta

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                // Chamar uma função para verificar se o token é válido
                const isValid = await TokenService.checkResetPasswordValidation(token);
                setValidToken(isValid);
            } catch (error) {
                console.error('Error checking token validity:', error);
                setValidToken(false);
            }
        };

        if (token) {
            checkTokenValidity();
        } else {
            setValidToken(false);
        }
    }, [token]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newPassword = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        console.log(token, newPassword, confirmPassword);
       
        try{
            const response = await AuthService.resetPassword(token, newPassword, confirmPassword);
            console.log(response);
            if (response && response.status === 200) {
                navigate('/');
            } else if (response && response.status === 400) {
                toast.error("Something went wrong");
                console.log("1");
            } else {
                console.log("2");
                throw new Error("Something went wrong");
                
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("An error occurred, please try again later.");
        }

    };

    if (!token || !validToken) {
        // Se o token não existir ou não for válido, redirecionar para uma página de erro
        navigate('/404');
    }


    return (
        <div className='container-initial-generic'>
            <ToastContainer position="top-center" /> {/* ToastContainer for displaying notifications */}
            <div className='container-index container-fg'>
                <div className='top' style={{ textAlign: 'center' }}>
                    <div className='logo-top' >
                        <img src={logo} alt="Logo da empresa" style={{ width: '50%', height: 'auto' }} />
                    </div> 
                    <h1 style={{ fontSize: '1.5em', padding:'35px' }}>Reset your password</h1>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" />
                    <button type="submit">Submit</button>
                </form>
                <p style={{textDecorationLine: 'underline', cursor: 'pointer'}} onClick={() => navigate('/')} >Cancel</p>
            </div>
        </div>
    )
};

export default ResetPassword;