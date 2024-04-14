import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../Components/Assets/agileflow-high-resolution-logo-transparent.png'
import AuthService from "../Components/Service/AuthService"
import TokenService from "../Components/Service/TokenService"

const ConfirmPassword = () => {
    // Hook for navigation
    const navigate = useNavigate();
    const [validToken, setValidToken] = useState(false);
    const { search } = useLocation(); // Captura a string de consulta da URL
    const params = new URLSearchParams(search);
    const token = params.get('token'); // Obtém o valor do parâmetro 'token' da string de consulta
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await AuthService.getUsernamePending(token);
                console.log(response);
                if (response && response.status === 200) {
                    setUsername(response.data);
                } else {
                    throw new Error("Something went wrong");
                }
            } catch (error) {
                console.error('Error fetching data:', error); 
            }
        };

        const checkTokenValidity = async () => {
            try {
                // Chamar função para verificar se o token é válido
                const isValid = await TokenService.checkAccountConfirmValidation(token);
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

        fetchUsername();

    }, [token]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newPassword = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        
        try{
            const response = await AuthService.setFirstPassword(token, newPassword, confirmPassword);
            console.log(response);
            if (response && response.status === 200) {
                navigate('/');
            } else if (response && response.status === 400) {
                toast.error("Something went wrong");
            } else {
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
                    <h1 style={{ fontSize: '1.5em', padding:'35px' }}>{username}, we are almost officially friends!</h1>
                    <p>Please set your password</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" />
                    <button type="submit">Submit</button>
                </form>
                
            </div>
        </div>
    )
};

export default ConfirmPassword;