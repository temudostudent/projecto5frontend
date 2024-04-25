import { useEffect } from "react"; 
import { userStore } from '../../Stores/UserStore'
import { useNotificationStore } from "../../Stores/NotificationStore";
import { useTaskStore } from "../../Stores/TaskStore";
import { useLocation } from 'react-router-dom';

function useWebSocketClient(selectedFilter, selectedOption){ 

    const location = useLocation(); // Get current location
    const {replaceOrAddMessageNotification} = useNotificationStore(); 
    const {replaceTaskById, deleteTaskById, addTask} = useTaskStore(); 
    const {token} = userStore();
    const WS_URL = "ws://localhost:8080/project_backend/websocket/"; 

    useEffect(() => { 
        const websocket = new WebSocket(WS_URL+`/notifier/${token}`);
        console.log("WebSocket created");
        websocket.onopen = () => { 
            console.log("The websocket connection is open"); 
        } 

        websocket.onmessage = (event) => { 
            const data  = JSON.parse(event.data);
            console.log(".....a receber....");
            console.log("Data received: ", data);
            
            if (data.dtoType === "Notification") { 
                replaceOrAddMessageNotification(data);  
            } else if (data.dtoType === "Task") { 

                console.log(selectedFilter, selectedOption);
                if(data.deleteThis){
                    deleteTaskById(data.id);
                }else if(data.createThis && location.pathname === '/alltasks' && (selectedFilter === 'All') ||
                (selectedFilter === 'State' && selectedOption === 'Active') ||
                (selectedFilter === 'Categories' && selectedOption === data.category.name) ||
                (selectedFilter === 'Users' && selectedOption === data.owner.username)){
                    addTask(data);
                }else{
                    replaceTaskById(data);
                }
            } 
             
        } 

        websocket.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };
    
        websocket.onclose = (event) => {
            console.log('WebSocket connection closed: ', event);
        };

        return () => {
            console.log('Component unmounting');
            websocket.close();
        };
    },[selectedFilter, selectedOption] );

} 
    
export default useWebSocketClient;