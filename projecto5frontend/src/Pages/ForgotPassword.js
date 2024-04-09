import React from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../Components/Assets/agileflow-high-resolution-logo-transparent.png'
import { useNavigate } from 'react-router-dom'
import AuthService from "../Components/Service/AuthService"

const ForgotPassword = () => {
    // Hook for navigation
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const email = e.target.email.value;
        console.log(email);
        try{
            const response = await AuthService.forgotPassword( email );
            if (response && response.status === 200) {
                toast.success("We have sent you an email with further instructions");
                navigate('/');
            } else if (response && response.status === 401) {
                toast.error("Email not registered");
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("An error occurred, please try again later.");
        }

    };


    return (
        <div className='container-forgotPassword'>
            <ToastContainer position="top-center" /> {/* ToastContainer for displaying notifications */}
            <div className='container-index container-fg'>
                <div className='top' style={{ textAlign: 'center' }}>
                    <div className='logo-top' >
                        <img src={logo} alt="Logo da empresa" style={{ width: '50%', height: 'auto' }} />
                    </div> 
                    <h1 style={{ fontSize: '1.5em', padding:'35px' }}>Reset your password</h1>
                    <p>We will send you an email to reset your password.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" />
                    <button type="submit">Reset Password</button>
                </form>
                <p style={{textDecorationLine: 'underline', cursor: 'pointer'}} onClick={() => navigate('/')} >Cancel</p>
            </div>
        </div>
    )
};

export default ForgotPassword;