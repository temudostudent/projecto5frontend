import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService';
import { userStore } from '../Stores/UserStore'

const PublicProfile = () => {
  const { username } = useParams();
  const token = userStore((state) => state.token);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getUserData(token, username);
        console.log("aqui", userData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username]);

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
              <p>Número total de tarefas!!!!!!!!</p>
              <p>Número de tarefas por estado!!!!!!!!!!</p>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default PublicProfile;