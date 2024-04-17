import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService';
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import Sidebar from '../Components/CommonElements/Sidebar'
import { userStore } from '../Stores/UserStore'
import { useActionsStore } from '../Stores/ActionStore'
import { AiOutlineMessage } from "react-icons/ai";
import { IconContext } from "react-icons";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../Translations"; 

const PublicProfile = () => {
  const { username } = useParams();
  const {token, locale, updateReceiverData, receiverData} = userStore();
  const [userData, setUserData] = useState(null);
  const [userTasksCount, setUserTasksCount] = useState([]);
  const { showSidebar, updateShowSidebar } = useActionsStore(); 


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getUserData(token, username);
        
        setUserData(userData);
        updateReceiverData(userData);
        console.log(receiverData);
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
        <div className="sidebar-container">
              <Sidebar
                  collapsedWidth={showSidebar ? '100%' : '0'}
                  userPath={username}
              />
          </div>
        {userData && 
          <div className='profile-info-container'>
            <div className='profile-container-left'>
              <h2>Profile of {userData.username}</h2>
              <p>First Name: {userData.firstName}</p>
              <p>Last Name: {userData.lastName}</p>
              <p>Email: {userData.email}</p>
              <span className="photo-info-container">
                  <img src={userData.photoURL} alt="Profile Pic" /> {/* Show profile picture */}
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