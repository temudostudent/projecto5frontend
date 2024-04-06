import React, { useState, useEffect } from "react";
import logo from '../Assets/agileflow-high-resolution-logo-transparent.png'
import defaultPhoto from "../Assets/profile_pic_default.png"
import './CommonElements.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import AuthService from "../Service/AuthService"
import Menu from './Menu'
import { userStore } from '../../Stores/UserStore'
import { useActionsStore } from '../../Stores/ActionStore'
import { useCategoryStore } from '../../Stores/CategoryStore'
import { useTaskStore } from '../../Stores/TaskStore'
import { useUsersListStore } from '../../Stores/UsersDataStore'

const Header = () => {
    // Accessing state variables and functions from stores
    const token = userStore((state) => state.token);
    const userData = userStore((state) => state.userData);
    const navigate = useNavigate();
    const [showAccountDrop, setShowAccountDrop] = useState(false);
    const [headerUsername, setHeaderUsername] = useState('');
    const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
    const { updateIsAllTasksPage } = useActionsStore();
   

    // Fetching user header data

    useEffect(() => {
        userHeaderData();
        console.log(userData);
    }, [token, userData.photoURL])


    const userHeaderData = async() => {
        setHeaderUsername(userData.username);
        setHeaderPhoto(userData.photoURL);
    }

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            await AuthService.logout(token);
            userStore.getState().resetUserStore();
            useActionsStore.getState().resetUseActionsStore();
            useCategoryStore.getState().resetUseCategoryStore();
            useTaskStore.getState().resetUseTaskStore();
            useUsersListStore.getState().resetUseUsersListStore();
            
            navigate('/');
        }catch (error) {
            console.log(error);
        }
    }
    
    // Menu items
    const items = [
        {   
            name: "Board", 
            color: "#c8ae7e", 
            submenu: [
                { name: "My ScrumBoard", path: "/home", onClick: () => {updateIsAllTasksPage(false)} },
                { name: "Complete ScrumBoard", path: "/alltasks", onClick: () => {updateIsAllTasksPage(true)} },
            ] 
        },
        {   
            name: "Categories", 
            color: "#2D9596", 
            path: "/categories" 
        },
        {   
            name: "Users", 
            color: "#4d7d99",
            
            path: (userData.typeOfUser === 200) ? "/users" : null,
          
            submenu: (userData.typeOfUser === 300) ? [
                { name: "Manage Users", path: "/users" },
                { name: "Add New User", path: "/register-user" }
            ] : null
        },
        {   
            name: "Dashboard", 
            color: "#4d6199", 
            path: "/dashboard" 
        },
    ];

    return (
        <header className="site-header">
            <ToastContainer position="top-center" />
            {/* Logo */}
            <div className="site-identity">
                <img src={logo} alt="Logo da empresa" />
            </div> 
            {/* Menu */}
            <Menu items={items} typeOfUser={userData.typeOfUser}/>
            {/* User profile */}
            <div className="profile-container" onClick={() => setShowAccountDrop(true)}>
                <a>{headerUsername}</a> {/* Show username */}
                <span className="photo-container">
                    <img src={headerPhoto} alt="Profile Pic" /> {/* Show profile picture */}
                </span> 
            </div>
            {/* Dropdown menu for account */}
            {showAccountDrop && (
            <div className="accountDrop" onMouseLeave={() => setShowAccountDrop(false)}>
                <a onClick={() => navigate(`/edit/${userData.username}`)}>My Profile</a>
                <a onClick={handleLogout}>Logout</a>

            </div>
            )}
        </header>
    );
};



export default Header;