import React, { useEffect, useState } from "react";
import "react-chat-elements/dist/main.css"
import { IoIosSend } from "react-icons/io";
import { IconContext } from "react-icons";
import { MessageList, Input } from 'react-chat-elements'
import MessageService from '../Components/Service/MessageService';
import { userStore } from '../Stores/UserStore'

const Chat = () => {
  const {token, userData, receiverData} = userStore();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchMessages = async() => {
      try {
        const response = await MessageService.getMessagesBetweenTwoUsers(token, userData.username, receiverData.username);
        
        if (!response) {
          console.error('No response from the server');
          return;
        }
  
        const formattedResponse = response.map(message => ({
          position: message.sender.username === userData.username ? "right" : "left",
          type: "text",
          title: message.sender.username,
          text: message.content,
          date: message.timestamp,
          status: message.readStatus === false ? "sent" : "read",
          avatar: message.sender.username === userData.username ? userData.photoURL : receiverData.photoURL,
          titleColor: message.sender.username === userData.username ? "#D7693C" : "#2C94D9",
        }));

        console.log(formattedResponse);
  
        setMessages(formattedResponse);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  
    fetchMessages();
  }, []);

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
    const response = await MessageService.sendMessage(content, token, receiverData.username);
    
    if (!response) {
      console.error('No response from the server');
      return;
    }

    // Format the response message
    const  formattedMessage= {
      position: "right",
      type: "text",
      title: userData.username,
      text: content,
      date: response.timestamp,
      status: "sent",
      avatar: userData.photoURL,
      titleColor: "#D7693C",
    };

    // Add the formatted message to the messages list
    setMessages([...messages, formattedMessage]);
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
        toBottomHeight={'100%'}
        dataSource={messages}
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