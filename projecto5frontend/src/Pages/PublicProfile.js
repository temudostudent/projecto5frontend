import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService';
import StatsService from '../Components/Service/StatsService';
import MessageService from '../Components/Service/MessageService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import Sidebar from '../Components/CommonElements/Sidebar'
import { userStore } from '../Stores/UserStore'
import { useActionsStore } from '../Stores/ActionStore'
import { useMessageStore } from '../Stores/MessageStore'
import { AiOutlineMessage } from "react-icons/ai";
import { IconContext } from "react-icons";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../Translations"; 

const PublicProfile = () => {
  const { username } = useParams();
  const {token, userData, locale, updateReceiverData} = userStore();
  const {updateMessages} = useMessageStore();
  const [userConsultedData, setUserConsultedData] = useState([]);
  const [userTasksCount, setUserTasksCount] = useState([]);
  const { showSidebar, updateShowSidebar } = useActionsStore();
  const messageListRef = useRef(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const thisUserData = await AuthService.getUserData(token, username);
        
        setUserConsultedData(thisUserData);
        updateReceiverData(thisUserData);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchStats = async () => {
      try{
        const totalTasks = await StatsService.getCountTasks(token, username, null);

        console.log(totalTasks);

        setUserTasksCount(totalTasks);
      }catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchUserData();
    fetchStats();
  }, [username, token]);

  // Fetch messages when component is mounted
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await MessageService.getMessagesBetweenTwoUsers(token, userData.username, username);
        
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
          avatar: message.sender.username === userData.username ? userData.photoURL : userConsultedData.photoURL,
          titleColor: message.sender.username === userData.username ? "#D7693C" : "#2C94D9",
        }));
  
        updateMessages(formattedResponse);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  
    fetchMessages();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messageListRef.current) {
      const { scrollHeight, clientHeight } = messageListRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      messageListRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [userStore.messages]);

  //Info formatada para mostrar as legendas pretendidas
  const userStats =[
    { name: 'To Do', value: userTasksCount.toDo, fill:'#c8ae7e44'  },
    { name: 'Doing', value: userTasksCount.doing, fill:'#59a4b16b' },
    { name: 'Done', value: userTasksCount.done, fill:'#4d7d9980' },
  ];

  const handleLetsChatButton = () => {
    updateShowSidebar(false);
  }


  return (
    <div>
      <IntlProvider locale={locale} messages={languages[locale]}>
      <div className='profile-info-body'>
        <div className="sidebar-container" ref={messageListRef}>
              <Sidebar
                  collapsedWidth={showSidebar ? '100%' : '0'}
                  userPath={username}
              />
          </div>
        {userData && 
          <div className='profile-info-container'>
            <div className='profile-container-left'>
              <h2>Profile of {userConsultedData.username}</h2>
              <p>First Name: {userConsultedData.firstName}</p>
              <p>Last Name: {userConsultedData.lastName}</p>
              <p>Email: {userConsultedData.email}</p>
              <span className="photo-info-container">
                  <img src={userConsultedData.photoURL} alt="Profile Pic" /> {/* Show profile picture */}
              </span> 
              <div className='init-chat-bar' onClick={handleLetsChatButton}>
                <IconContext.Provider value={{ color: "#eee", size: "2.2em" }}>
                  <FormattedMessage id="lets-chat" />
                  <span>
                    <AiOutlineMessage />
                  </span>
                </IconContext.Provider>
              </div>
            </div>
            <div className='profile-statistics-container'>
              <p>Total tasks: {userTasksCount.tasks}</p>
              <div className='chart'>
                {userTasksCount.tasks > 0 && <DoughnutChart data={userStats} />}
              </div>
            </div>
          </div>
        }
      </div>
      </IntlProvider> 
    </div>
  );
}

export default PublicProfile;