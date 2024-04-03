import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService';
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import { userStore } from '../Stores/UserStore'

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
        const toDoTasks = await StatsService.getCountTasks(token, username, 100);
        const doingTasks = await StatsService.getCountTasks(token, username, 200);
        const doneTasks = await StatsService.getCountTasks(token, username, 300);

        setUserTasksCount([totalTasks, toDoTasks, doingTasks, doneTasks]);
      }catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchUserData();
    fetchStats();
  }, [username]);

  const userStats =[
    { name: 'To Do', value: userTasksCount[1] },
    { name: 'Doing', value: userTasksCount[2] },
    { name: 'Done', value: userTasksCount[3] },
  ];


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
            </div>
            <div className='profile-statistics-container'>
              <p>Total tasks: {userTasksCount[0]}</p>
              <div>
                {userTasksCount.length > 0 && <DoughnutChart data={userStats} />}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default PublicProfile;