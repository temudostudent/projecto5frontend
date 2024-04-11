import React, { useRef } from "react"
import SignupForm from "../Components/Forms/SignUpForm"
import { useNavigate } from 'react-router-dom'
import { userStore } from '../Stores/UserStore'

const RegisterUser = () => {
    const navigate = useNavigate(); // Get navigate function from useNavigate hook
    const navigateRef = useRef(navigate); // Create a ref to store navigate function
    const { token } = userStore(); // Retrieve token and userData from userStore

    // Function to handle sign-up success, navigates to "/home"
    const handleSignUpSuccess = () => {
        navigateRef.current("/home"); // Use ref to navigate to "/home"
    };

    return (
        <div className="container-register"> {/* Container for registration */}
            <SignupForm onSignUpSuccess={handleSignUpSuccess}
                        token={token}/> {/* Render SignUpForm with callback for sign-up success */}
        </div>
    );
}

export default RegisterUser;