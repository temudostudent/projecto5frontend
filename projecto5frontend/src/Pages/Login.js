import React, { useRef } from "react"
import logo from '../Components/Assets/agileflow-favicon-white.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginForm from '../Components/Forms/LoginForm'
import SignupForm from "../Components/Forms/SignUpForm"
import AuthService from '../Components/Service/AuthService';

function Login() {

    const containerRef = useRef(null);// Reference to the container element for handling animation

    // Function to handle ask success, removes right panel animation
    const handleSignUpSuccess = async(e) => {
        

        e.preventDefault();
        const emailInput = e.target.email;
        const email = emailInput.value;

        try{
            const response = await AuthService.applicationMembership( email );
            if (response && response.status === 200) {
                containerRef.current.classList.remove('right-panel-active');
                emailInput.value = '';

            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("An error occurred, please try again later.");
        }
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
        <div className="container-index" ref={containerRef}> {/* Container with reference for animation */}
            <ToastContainer position="top-center" /> {/* ToastContainer for displaying notifications */}
            <div className="form-container sign-up-container"> {/* Overlay for sign-up/login transition */}
                <div className="ask-signup-container">
                    <form action="#" onSubmit={handleSignUpSuccess}>
                        <h1>Join our community!</h1>
                        <p style={{ marginBottom: '20px' }}>Please contact us</p>
                        <input type="email" name="email" placeholder="Your Email" required />
                        <button type="submit">Contact us</button>
                    </form>
                </div>
            </div>
            {/* Commented because it was a feature of the previous project*/}
            {/*<SignupForm onSignUpSuccess={handleSignUpSuccess}/> {/* SignupForm component with callback for sign-up success */}
            
            
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
                        <button className="ghost" id='signUp' onClick={handleSignUpClick}>Join Us</button> {/* Sign Up button */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;