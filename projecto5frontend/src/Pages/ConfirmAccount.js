import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../Components/Assets/agileflow-high-resolution-logo-transparent.png'
import { useNavigate } from 'react-router-dom'
import AuthService from "../Components/Service/AuthService"

const ConfirmPassword = () => {
    // Hook for navigation
    const navigate = useNavigate();
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
                    //navigate('/');
                } else {
                    throw new Error("Something went wrong");
                }
            } catch (error) {
                console.error('Error fetching data:', error); 
            }
        };

        fetchUsername();

    }, [token]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        /*try{
            const response = await AuthService.resetPassword(token, newPassword, confirmPassword);
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
        }*/

    };


    return (
        <div className='container-initial-generic'>
            <ToastContainer position="top-center" /> {/* ToastContainer for displaying notifications */}
            <div className='container-index container-fg'>
                <div className='top' style={{ textAlign: 'center' }}>
                    <div className='logo-top' >
                        <img src={logo} alt="Logo da empresa" style={{ width: '50%', height: 'auto' }} />
                    </div> 
                    <h1 style={{ fontSize: '1.5em', padding:'35px' }}>{username} please confirm your account</h1>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        </div>
    )
};

export default ConfirmPassword;