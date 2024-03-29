import React, { useState } from "react"
import AuthService from "../Service/AuthService"
import { useLocation } from 'react-router-dom';

function SignUpForm({ onSignUpSuccess }) {

    // Hook to get the current location
    const location = useLocation();
    const { pathname } = location;
    // State variable for form inputs
    const [inputs, setInputs] = useState({});

    // Function to handle changes in input fields
    const handleChange = (event) => { 
        const { name, value } = event.target;
        setInputs({...inputs, [name]: value});
    }

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await AuthService.register(inputs);
    
            console.log(response);
    
            if (response.status === 201) {
                onSignUpSuccess();
                setInputs({});
            } else {
                console.error("Failed to register. Response:", response);
            }
        } catch (error) {
            console.error("An error occurred during registration:", error);
        }
    };

    return (

        <div className={pathname === "/" ? "form-container sign-up-container" : pathname === "/register-user" ? "form-container add-new-user-container" : "form-container"}>
            <form  action="#" onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <br />
                {/* Input fields */}
                    <input type="text" name="username" value={inputs.username || ''} placeholder="Username" onChange={handleChange} required/>
			        <input type="text" name="firstName" value={inputs.firstName || ''} placeholder="First Name" onChange={handleChange} required/>
			        <input type="text" name="lastName" value={inputs.lastName || ''} placeholder="Last Name" onChange={handleChange} required/>
			        <input type="email" name="email" value={inputs.email || ''} placeholder="Email" onChange={handleChange} required/>
                    <input type="text" name="phone" value={inputs.phone || ''} placeholder="Contact" onChange={handleChange} required/>
                    <input type="password" name="password" value={inputs.password || ''} placeholder="Password" onChange={handleChange} required/>
                    <input type="text" name="photoURL" value={inputs.photoURL || ''} placeholder="Profile Photo" onChange={handleChange} required/>
                    <button type="submit">Sign Up</button>
            </form>
        </div>
        
    )
}

export default SignUpForm;