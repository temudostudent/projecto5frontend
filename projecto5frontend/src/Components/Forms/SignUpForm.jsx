import React, { useState } from "react"
import AuthService from "../Service/AuthService"
import { useLocation } from 'react-router-dom';

function SignUpForm({ onSignUpSuccess, token }) {

    // Hook to get the current location
    const location = useLocation();
    const { pathname } = location;
    // State variable for form inputs
    const [inputs, setInputs] = useState({});
    const [selectedType, setSelectedType] = useState({});

    // Function to handle changes in input fields
    const handleChange = (event) => { 
        const { name, value } = event.target;
        setInputs({...inputs, [name]: value});
    }

    // Function to handle changes in select field
    const handleSelectChange = (event) => {
        setSelectedType(event.target.value);
    };

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

    // Function to handle form submission
    const handleSubmitPendingRegister = async (event) => {
        event.preventDefault();

        try {
            let typeOfUser = parseInt(selectedType);
                if(isNaN(typeOfUser)) {
                    typeOfUser = 100;
            }

            const dataToSend = {
                ...inputs,
                typeOfUser: typeOfUser
            };
            console.log(dataToSend);
            const response = await AuthService.registerPending(token, dataToSend);
    
            console.log(response);
    
            if (response.status === 201) {
                onSignUpSuccess();
                setInputs({});
                setSelectedType('');
            } else {
                console.error("Failed to register. Response:", response);
            }
        } catch (error) {
            console.error("An error occurred during registration:", error);
        }
    };

    return (

        <div className={pathname === "/" ? "form-container sign-up-container" : pathname === "/register-user" ? "form-container add-new-user-container" : "form-container"}>
            <form  action="#" onSubmit={pathname === "/" ? handleSubmit : handleSubmitPendingRegister}>
                <h1>Create Account</h1>
                <br />
                {/* Input fields */}
                    <input type="text" name="username" value={inputs.username || ''} placeholder="Username" onChange={handleChange} required/>
			        <input type="text" name="firstName" value={inputs.firstName || ''} placeholder="First Name" onChange={handleChange} required/>
			        <input type="text" name="lastName" value={inputs.lastName || ''} placeholder="Last Name" onChange={handleChange} required/>
			        <input type="email" name="email" value={inputs.email || ''} placeholder="Email" onChange={handleChange} required/>
                    <input type="text" name="phone" value={inputs.phone || ''} placeholder="Contact" onChange={handleChange} required/>
                    {!(pathname === '/register-user') && (
                        <input type="password" name="password" value={inputs.password || ''} placeholder="Password" onChange={handleChange} required/>
                    )}
                    
                    <input type="url" name="photoURL" value={inputs.photoURL || ''} placeholder="Profile Photo" onChange={handleChange}/>

                    {(pathname === '/register-user') && (
                        <select
                        name="typeOfUser"
                        value={selectedType}
                        onChange={handleSelectChange}
                        required
                        >
                        <option value={''} disabled>Select Type Of User</option>
                        <option value={100}>Developer</option>
                        <option value={200}>Scrum Master</option>
                        <option value={300}>Product Owner</option>
                      </select>
                    )}
                    <button type="submit">Sign Up</button>
            </form>
        </div>
        
    )
}

export default SignUpForm;