import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
 MainContainer,
 ChatContainer,
 MessageList,
 Message,
 MessageInput,
} from "@chatscope/chat-ui-kit-react";

function Chat() {

 return (
   <div style={{ position: "relative", height: "500px", width: "500px" }}>
     
     <MainContainer>
       <ChatContainer>
         <MessageList>
           <Message
             model={{
               message: "Hello World",
               sender: "Joe",
             }}
           />
         </MessageList>
         <MessageInput placeholder="Type message here" />
       </ChatContainer>
     </MainContainer>
     
   </div>
 );
 
}

export default Chat;