import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService';
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import { userStore } from '../Stores/UserStore'
import { AiOutlineMessage } from "react-icons/ai";
import { IconContext } from "react-icons";

const PublicProfile = () => {
  const { username } = useParams();
  const token = userStore((state) => state.token);
  const [userData, setUserData] = useState(null);
  const [userTasksCount, setUserTasksCount] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getUserData(token, username);
        
        setUserData(userData);
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

  console.log(userStats);


  return (
    <div>
      <div className='profile-info-body'>
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
              <div className='init-chat-bar'>
                <IconContext.Provider value={{ color: "#eee", size: "2.2em" }}>
                  Let's chat!
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
    </div>
  );
}

export default PublicProfile;