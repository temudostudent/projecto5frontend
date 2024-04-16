import React from "react";
import "react-chat-elements/dist/main.css"
import { IoIosSend } from "react-icons/io";
import { IconContext } from "react-icons";
import { MessageList, Input } from 'react-chat-elements'

function Chat() {

 return (
   <div className="chat-container">
     <MessageList
        className='message-list'
        lockable={true}
        toBottomHeight={'100%'}
        dataSource={[
        {
          position:"left",
          type:"text",
          title:"Kursat",
          text:"Give me a message list example !",
          date:"2024-04-16T09:30:00Z",
          status: "read",
          avatar:"https://image.flaticon.com/icons/svg/327/327779.svg",
          titleColor:"#D7693C"
        },
        {
          position:"right",
          type:"text",
          title:"Emre",
          text:"That's all.",
        },
        {
          position:"left",
          type:"text",
          title:"Kursat",
          text:"Give me a message list example !",
          date:"2024-04-16T09:30:00Z",
          status: "read",
          avatar:"https://image.flaticon.com/icons/svg/327/327779.svg",
          titleColor:"#D7693C"
        },
        {
          position:"right",
          type:"text",
          title:"Emre",
          text:"That's all.",
        },
        {
          position:"left",
          type:"text",
          title:"Kursat",
          text:"Give me a message list example !",
          date:"2024-04-16T09:30:00Z",
          status: "read",
          avatar:"https://image.flaticon.com/icons/svg/327/327779.svg",
          titleColor:"#D7693C"
        },
        {
          position:"right",
          type:"text",
          title:"Emre",
          text:"That's all.",
        },
        {
          position:"left",
          type:"text",
          title:"Kursat",
          text:"Give me a message list example !",
          date:"2024-04-16T09:30:00Z",
          status: "read",
          avatar:"https://image.flaticon.com/icons/svg/327/327779.svg",
          titleColor:"#D7693C"
        },
        {
          position:"right",
          type:"text",
          title:"Emre",
          text:"That's all.",
        },
        ]}
    />
    <Input
      className="chat-input"
      placeholder="Type here..."
      multiline={false}
      rightButtons={
        <>
          <IconContext.Provider value={{ color: "#eee", size: "1.5em" }}>
              <span className="send-message-button">
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