import { useEffect } from "react"; 
import { userStore } from '../../Stores/UserStore'
import { useNotificationStore } from "../../Stores/NotificationStore";

function WebSocketClient(){ 

    const { addNotification } = useNotificationStore(); 
    const {token} = userStore();
    const WS_URL = "ws://localhost:8080/project_backend/websocket/"; 

    useEffect(() => { 
        const websocket = new WebSocket(WS_URL+`/notifier/${token}`);
        websocket.onopen = () => { 
        console.log("The websocket connection is open"); 
        } 

        websocket.onmessage = (event) => { 
            const notification  = JSON.parse(event.data);
            addNotification(notification); 
        } 
    },[] );

} 
    
export default WebSocketClient;