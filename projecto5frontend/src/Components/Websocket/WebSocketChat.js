import { useEffect, useRef } from "react";
import { userStore } from '../../Stores/UserStore'
import { useMessageStore } from '../../Stores/MessageStore'


function WebSocketChat({ receiverUsername }){ 

    const { addMessage, markMessageAsRead } = useMessageStore();     
    const WS_URL = "ws://localhost:8080/project_backend/websocket/"; 
    const {token: senderToken} = userStore();

    // Use a ref to store the WebSocket instance
    const websocketRef = useRef(null);

    useEffect(() => { 
        const websocket = new WebSocket(WS_URL+`/chat/${senderToken}/${receiverUsername}`); 
        websocket.onopen = () => { 
            console.log("The websocket chat connection is open"); 
        } 

        websocket.onmessage = (event) => { 
            const message  = JSON.parse(event.data); 
            console.log("a new message is on!", message);

            if(message.readNow){
                markMessageAsRead(message.id);
            }else{
                const formattedMessage = {
                    id: message.id,
                    type: "text",
                    title: message.sender.username,
                    text: message.content,
                    date: Date.now(),
                    status: "read",
                    avatar: message.sender.photoURL,
                    titleColor: "#D7693C",
                }
                addMessage(formattedMessage);
            }
            
        } 

        // Store the WebSocket instance in the ref
        websocketRef.current = websocket;

        // Close the WebSocket connection when the component unmounts
        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        }
    },[receiverUsername] );


} 
export default WebSocketChat;