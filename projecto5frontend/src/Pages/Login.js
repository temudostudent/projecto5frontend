import React, { useRef } from "react"
import logo from '../Components/Assets/agileflow-favicon-white.png'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginForm from '../Components/Forms/LoginForm'
import SignupForm from "../Components/Forms/SignUpForm"

function Login() {

    const containerRef = useRef(null);// Reference to the container element for handling animation

    // Function to handle sign-up success, removes right panel animation
    const handleSignUpSuccess = () => {
        containerRef.current.classList.remove('right-panel-active');
    }

    // Function to handle login click, removes right panel animation
    const handleLoginClick = () => {
        containerRef.current.classList.remove('right-panel-active');
    }

    // Function to handle sign-up click, adds right panel animation
    const handleSignUpClick = () => {
        containerRef.current.classList.add('right-panel-active');
    }

    return (
        <div className="container" ref={containerRef}> {/* Container with reference for animation */}
            <ToastContainer position="top-center" /> {/* ToastContainer for displaying notifications */}
            <SignupForm onSignUpSuccess={handleSignUpSuccess}/> {/* SignupForm component with callback for sign-up success */}
            <LoginForm /> {/* LoginForm component */}
            <div className="overlay-container"> {/* Overlay for sign-up/login transition */}
                <div className="overlay">
                    <div className="overlay-panel overlay-left"> {/* Left panel for login */}
                        <div className='logo-top' style={{ textAlign: 'center' }}> {/* Logo */}
                            <img src={logo} alt="Logo da empresa" style={{ width: '50%', height: 'auto' }} />
                        </div> 
                        <h1>Welcome Back!</h1> {/* Title */}
                        <p>To keep connected with us please login with your personal info</p> {/* Description */}
                        <button className="ghost" id='login' onClick={handleLoginClick}>Login</button> {/* Login button */}
                    </div>
                    <div className="overlay-panel overlay-right"> {/* Right panel for sign-up */}
                        <h1>Hello, Friend!</h1> {/* Title */}
                        <p>Enter your personal details and start journey with us</p> {/* Description */}
                        <button className="ghost" id='signUp' onClick={handleSignUpClick}>Sign Up</button> {/* Sign Up button */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;