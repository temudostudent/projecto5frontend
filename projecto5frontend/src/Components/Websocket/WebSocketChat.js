import { useEffect } from "react";
import { userStore } from '../Stores/UserStore'


function WebSocketChat(){ 

    
    const WS_URL = "ws://localhost:8080/project_backend/websocket/"; 
    const {token} = userStore();


    useEffect(() => { 
        const websocket = new WebSocket(WS_URL+`/chat/${token}/${token2}`); 
        websocket.onopen = () => { 
            console.log("The websocket chat connection is open"); 
            // Send the receiverToken and senderToken when sending a message
            websocket.send(JSON.stringify({receiverToken: 'receiverToken', message: 'Hello' }));
        } 

        websocket.onmessage = (event) => { 
            const message  = event.data; 
            console.log("a new message is on!", message);

        } 
    },[] );



} 
    
export default WebSocketChat;