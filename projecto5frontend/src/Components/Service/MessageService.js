import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/project_backend/rest/message';

const MessageService = {

/*----------------------
MESSAGES
----------------------*/

    // Function to get messages between two users
    getMessagesBetweenTwoUsers: async (token, username1, username2) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/?user1=${username1}&user2=${username2}`, {
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
            console.error('Error getting messages:', error);
        }
    },
    
    // Function to send a message
    sendMessage: async (content, token, receiver) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/send?to=${receiver}`, 
            {
                content: content
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                console.log("Invalid credentials");
            } else {
                console.log(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

    // Function to set messages as read
    setAllMessagesRead: async (token, username1, username2) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/read?user1=${username1}&user2=${username2}`, null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            });
            if (response.status === 200) {
                console.log(response.data);
            } else if (response.status === 401) {
                console.log(response.data);
            } else if (response.status === 400) {
                console.log(response.data);
            }else {
                console.log(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

};
export default MessageService;