import axios from 'axios'
import { toast } from 'react-toastify'

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

    getLatestNotifications: async (token, username) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${username}/latest`, {
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

    markAllNotificationsAsRead: async (token) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/read`, null,{
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                toast.success(response.data);
            } else if (response.status === 401) {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    markAllFromSenderToReceiverAsRead: async (token, senderUsername, receiverUsername, type) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/read/${senderUsername}/${receiverUsername}/?type=${type}`, null,{
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                console.log('notifications marked as read')
            } else if (response.status === 401) {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    
};
export default NotificationService;