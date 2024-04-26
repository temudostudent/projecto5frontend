import React, { useEffect, useState } from "react";
import "react-chat-elements/dist/main.css"
import { IoIosSend } from "react-icons/io";
import { IconContext } from "react-icons";
import { MessageList, Input } from 'react-chat-elements'
import MessageService from '../Components/Service/MessageService';
import { userStore } from '../Stores/UserStore'
import { useMessageStore } from '../Stores/MessageStore'
import WebSocketChat from '../Components/Websocket/WebSocketChat';

const Chat = (props) => {
  const {token, userData} = userStore();
  const {receiverUsername} = props;
  const {messages, addMessage} = useMessageStore();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const wsChat = WebSocketChat({ receiverUsername: receiverUsername });

  useEffect(() => {
    setChatMessages(messages);

    console.log("Messages:", messages);
  }, [messages]);

  {/*EXEMPLO
    position:"left",
    type:"text",
    title:"Kursat",
    text:"Give me a message list example !",
    date:"2024-04-16T09:30:00Z",
    status: "read",
    avatar:"https://image.flaticon.com/icons/svg/327/327779.svg",
titleColor:"#D7693C"*/}

const handleInputChange = (event) => {
  setInputValue(event.target.value);
};
  
const handleSubmit = async (content) => {
  
  try {
    // Call the API to send the message
    const response = await MessageService.sendMessage(content, token, receiverUsername);

    if (!response) {
      console.error('No response from the server');
      return;
    }

    // Format the response message
    const formattedMineMessage= {
      id: response.toString(),
      position: "right",
      type: "text",
      title: userData.username,
      text: content,
      date: Date.now(),
      status: "sent",
      avatar: userData.photoURL,
      titleColor: "#D7693C",
    };

    addMessage(formattedMineMessage);
    setInputValue('');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


 return (
   <div className="chat-container">
     <MessageList
      className='message-list'
      lockable={true}
      toBottomHeight='100%'
      dataSource={chatMessages}
    />
    <Input
      className="chat-input"
      placeholder="Type here..."
      multiline={false}
      value={inputValue}
      onChange={handleInputChange}
      rightButtons={
        <>
          <IconContext.Provider value={{ color: "#eee", size: "1.5em" }}>
              <span className="send-message-button" onClick={() => handleSubmit(inputValue)}>
                <IoIosSend />
              </span>
          </IconContext.Provider>
        </>
      }
    />
     
     
   </div>
 );
 
}

export default Chat;