import React from 'react'
import AuthService from '../Components/Service/AuthService'
import EditProfileForm from '../Components/Forms/EditProfileForm'
import { userStore } from '../Stores/UserStore'
import Header from '../Components/CommonElements/Header'

const Profile = () => {

  // Retrieve user data and token from userStore
    const userData = userStore((state) => state.userData);
    const updateUserData = userStore((state) => state.updateUserData);
    const token = userStore((state) => state.token);

     // Function to handle update success of user profile
     const handleUpdateSuccess = async (inputs) => {
      try {
          // Attempt to update user profile using AuthService
          const updateResponse = await AuthService.updateUser(token, userData.username, inputs);
          if (updateResponse) {
              // If update is successful, retrieve updated user data and update userStore
              await AuthService.getUserData(token, userData.username);
              updateUserData({ ...userData, ...inputs });
          } else {
              console.error("Update unsuccessful:", updateResponse); // Log error if update is unsuccessful
          }
      } catch (error) {
          console.error("Error updating profile:", error); // Log error if updating profile encounters an error
      }
  };

  return (
      <div>
          <Header /> {/* Render Header component */}
          <div className='edit-profile-body'>
              <div className='edit-profile-container'>
                  {userData && // Render EditProfileForm component if userData is available
                      <EditProfileForm
                          username={userData.username}
                          printData={userData}
                          onUpdateSuccess={handleUpdateSuccess} />}
              </div>
          </div>
      </div>
  );
}

export default Profile;