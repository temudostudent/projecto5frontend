import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/project_backend/rest/notification';

const NotificationService = {

/*----------------------
NOTIFICATIONS
----------------------*/

    getNotificationsByReadStatus: async (token, status) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/?readed=${status}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.error('Error getting unreaded notifications:', error);
        }
    },

    getNotifications: async (token, username) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.error('Error getting all notifications:', error);
        }
    },

    
};
export default NotificationService;