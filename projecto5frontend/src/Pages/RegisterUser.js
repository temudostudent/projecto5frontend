import React, { useRef } from "react"
import SignupForm from "../Components/Forms/SignUpForm"
import { useNavigate } from 'react-router-dom'

const RegisterUser = () => {
    const navigate = useNavigate(); // Get navigate function from useNavigate hook
    const navigateRef = useRef(navigate); // Create a ref to store navigate function

    // Function to handle sign-up success, navigates to "/home"
    const handleSignUpSuccess = () => {
        navigateRef.current("/home"); // Use ref to navigate to "/home"
    };

    return (
        <div className="container-register"> {/* Container for registration */}
            <SignupForm onSignUpSuccess={handleSignUpSuccess}/> {/* Render SignUpForm with callback for sign-up success */}
        </div>
    );
}

export default RegisterUser;