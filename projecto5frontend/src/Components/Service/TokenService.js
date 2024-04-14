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
            if (response.status === 200) {
                return response;
            } else if (response.status === 401) {
                toast.warning("Invalid credentials");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        };
    },

};

export default TokenService;