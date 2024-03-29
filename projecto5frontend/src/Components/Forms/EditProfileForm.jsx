import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { userStore } from '../../Stores/UserStore'
import { useLocation } from 'react-router-dom';

// Setting the root element for the modal
Modal.setAppElement('#root');

const EditProfileForm = ({username, printData, onUpdateSuccess}) => {

    // State variables
    const [inputs, setInputs] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { token, userData} = userStore();
    const location = useLocation();
  
    // Function to handle changes in input fields
    const handleChange = (event) => {
      const { name, value } = event.target;
    
      // Handling special case for typeOfUser
      if (name === 'typeOfUser') {
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
      } else {
        // Para outros campos, atualize o estado como antes
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
      }
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault(); 
      onUpdateSuccess(inputs, username);
      setInputs({}); 
      event.target.reset();
    };


    // Function to handle modal form submission
    const handleSubmitModal = async (event) => {
      event.preventDefault();

      const { profile_oldPassword, profile_newPassword, profile_confirmPassword } = inputs;

        if (profile_newPassword !== profile_confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

      try{  
        const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${printData.username}/password`, 
          {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': '*/*',
                  'token': token,
                  'oldpassword': inputs.profile_oldPassword,
                  'newpassword': inputs.profile_newPassword,
              },
          });

          if (response.status === 200) {
              toast.success('Password updated successfully');
              setModalIsOpen(false);
              setInputs({});
              event.target.reset();
          } else if (response.status === 401) {
              toast.warning(response.statusText); 
          } else {
              toast.error(response.statusText);
          }
      } catch (error) {
          console.error('Error updating password:', error);
          toast.error('Error updating password. Please try again later.');
      }
      };


    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder={printData.firstName || ''} 
            onChange={handleChange}
            disabled={userData.typeOfUser === 200}
          />
          <br />
    
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName" 
            placeholder={printData.lastName || ''}
            onChange={handleChange}
            disabled={userData.typeOfUser === 200}
          />
          <br />
    
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            
            placeholder={printData.email || ''}
            onChange={handleChange}
            disabled={userData.typeOfUser === 200}
          />
          <br />

          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            name="phone" 
            
            placeholder={printData.phone || ''}
            onChange={handleChange}
            disabled={userData.typeOfUser === 200}
          />
          <br />
    
          <label htmlFor="photoUrl">Photo URL:</label>
          <input
            type="url"
            name="photoURL" 
            
            placeholder={printData.photoURL || ''}  
            onChange={handleChange}
            disabled={userData.typeOfUser === 200}
          />
         {(location.pathname === '/users') && (userData.typeOfUser===300) && (
            <>
              <br />
              <label htmlFor="typeOfUser">Type:</label>
              <select
                name="typeOfUser"
                value={inputs.typeOfUser || printData.typeOfUser}
                onChange={handleChange}
              >
                <option value={100}>Developer</option>
                <option value={200}>Scrum Master</option>
                <option value={300}>Product Owner</option>
              </select>
              </>
          )}
          {!(location.pathname === '/users' && userData.typeOfUser === 200) && (
  <>
          <br />
          <div className="editProfile-buttons-container">
          {!(location.pathname === '/users') && (
              <button type="button" onClick={() => setModalIsOpen(true)}>Change Password</button>
          )}
              <button type="submit">Submit</button>
          </div>
          </>
          )}
          
      </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Change Password Modal"
                className='react-modal'
            >
                <h2>Change Password</h2>
                <form id="changePasswordForm" onSubmit={handleSubmitModal}>
                    <input type="password" name="profile_oldPassword" placeholder="Current Password:" required onChange={handleChange} />
                    <input type="password" name="profile_newPassword" placeholder="New Password" required onChange={handleChange} />
                    <input type="password" name="profile_confirmPassword" placeholder="Confirm New Password" required onChange={handleChange} />
                    <button type="submit">Save</button>
                </form>
                <button onClick={() => setModalIsOpen(false)}>Close Modal</button>
            </Modal>
      </div>
      
    );
  };

  export default EditProfileForm;