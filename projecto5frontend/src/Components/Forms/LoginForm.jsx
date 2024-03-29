import React, { useState } from "react"
import logo from '../Assets/agileflow-high-resolution-logo-transparent.png'
import { useNavigate } from 'react-router-dom'
import { userStore } from '../../Stores/UserStore'
import AuthService from "../Service/AuthService"

function LoginForm() {

    // State variables
    const [inputs, setInputs] = useState({});
    // Accessing store methods
    const updateToken = userStore((state) => state.updateToken);
    const updateUserData = userStore((state) => state.updateUserData);
    // Hook for navigation
    const navigate = useNavigate();
    
    // Function to handle changes in input fields
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value}))
    }

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try{

            // Attempting login
            const response = await AuthService.login(inputs);
                if (response.status === 200) {
                    const data = await response.data;
                    updateToken(data);
                    fetchUserData(data);
                    navigate('/home', {replace: true});
                } else if (response.status === 401) {
                    alert("Invalid credentials, please try again");
                } else {
                    throw new Error("Something went wrong");
                }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert("An error occurred, please try again later.");
        };
    }

    // Function to fetch user data after successful login
    const fetchUserData = async (token) => {
        try {
            const username = await AuthService.getUsername(token);
            const userData = await AuthService.getUserData(token, username);
            await updateUserData(userData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    
    return (
        <div className="form-container login-container">
            {/* Login form */}
            <form  action="#" onSubmit={handleSubmit}>
                    <div className='logo-top' style={{ textAlign: 'center' }}>
                        <img src={logo} alt="Logo da empresa" style={{ width: '70%', height: 'auto' }} />
                    </div> 
                    <br/>
                    {/* Username input */}
                    <input 
                        type="text"
                        name="username"
                        value={inputs.username || ''}   
                        placeholder="Username" 
                        onChange={handleChange}
                        required
                    />
                    {/* Password input */}
                    <input 
                        type="password" 
                        name="password"
                        value={inputs.password || ''} 
                        placeholder="Password" 
                        onChange={handleChange}
                        required
                    />
                    {/* Submit button */}
                    <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginForm