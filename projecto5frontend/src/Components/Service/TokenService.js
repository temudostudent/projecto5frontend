import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE_URL = 'http://localhost:8080/project_backend/rest/token';

const TokenService = {


// Function to verify reset password token
    checkResetPasswordValidation: async (token) => {

        try{
            const response = await axios.get(`${API_BASE_URL}/reset-password`, 
            {
                headers: 
                {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response.status === 200) {
                return response;
            } else if (response.status === 401) {
                toast.warning("Invalid credentials");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        };
    },

    // Function to verify account confirmation token
    checkAccountConfirmValidation: async (token) => {

        try{
            const response = await axios.get(`${API_BASE_URL}/confirmation-account`, 
            {
                headers: 
                {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response) {
                if (response.status === 200) {
                    return { response, status: response.status }; // Include status in the return value
                } 
            } else {
                throw new Error("No response received from the server");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return { response: error.response, status: error.response.status };
            } else {
                throw new Error("Something went wrong");
            }
            console.error('There was a problem with the fetch operation:', error);
        }
    },

};

export default TokenService;