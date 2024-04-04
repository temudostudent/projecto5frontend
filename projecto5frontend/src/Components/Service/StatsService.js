import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE_URL = 'http://localhost:8080/project_backend/rest/statistics';

const StatsService = {

/*----------------------
USER
----------------------*/

    // Function to get users stats
    getCountUsers: async (token, typeOfUser) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                params: {
                    type: typeOfUser
                }
            });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                toast.warning("Invalid credentials")
            }
        } catch (error) {
            console.error('Error getting users count:', error);
        }
    },

    // Function to get tasks stats
    getCountTasks: async (token, username, stateId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tasks`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                params: {
                    username: username,
                    state: stateId
                }
            });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                toast.warning("Invalid credentials")
            }
        } catch (error) {
            console.error('Error getting tasks count:', error);
        }
    },


}

export default StatsService;