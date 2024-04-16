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
import { useNotificationStore } from '../../Stores/NotificationStore';
import languages from "../../Translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import WebSocketClient from "../Websocket/WebSocketClient";


const Header = () => {
    WebSocketClient();
    // Accessing state variables and functions from stores
    const { notifications } = useNotificationStore();
    const {token, userData, locale, updateLocale} = userStore();
    const navigate = useNavigate();
    const [showAccountDrop, setShowAccountDrop] = useState(false);
    const [headerUsername, setHeaderUsername] = useState('');
    const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
    const [selectedLanguage, setSelectedLanguage] = useState(locale);
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

    const handleClick = (language) => {
        console.log(language);
        updateLocale(language);
        setSelectedLanguage(language);
    }
    
    // Menu items
    const items = [
        {   
            name: "board", 
            color: "#c8ae7e", 
            submenu: [
                { name: "my_scrumBoard", path: "/home", onClick: () => {updateIsAllTasksPage(false)} },
                { name: "complete_scrumBoard", path: "/alltasks", onClick: () => {updateIsAllTasksPage(true)} },
            ] 
        },
        {   
            name: "categories", 
            color: "#2D9596", 
            path: "/categories" 
        },
        {   
            name: "users", 
            color: "#4d7d99",
            
            path: (userData.typeOfUser === 200) ? "/users" : null,
          
            submenu: (userData.typeOfUser === 300) ? [
                { name: "manage_users", path: "/users" },
                { name: "add_new_user", path: "/register-user" }
            ] : null
        },
        {   
            name: "dashboard", 
            color: "#4d6199", 
            path: "/dashboard" 
        },
    ];

    return (
        <header className="site-header">
            <IntlProvider locale={locale} messages={languages[locale]}> 
            <ToastContainer position="top-center" />
            <div className="top-header">
                {/*<select className="language-select" onChange={handleSelect} defaultValue={locale}> 
                    {["en", "pt", "fr"].map(language => (<option            
                    key={language}>{language}</option>))} 
                    </select>*/}
                <div className="language-select">
                    {["en", "pt", "fr"].map((language, index) => (
                        <React.Fragment key={language}>
                            <span className={selectedLanguage === language ? "selected" : ""} onClick={() => handleClick(language)}>
                                {language.toUpperCase()}
                            </span>
                            {index !== ["en", "pt", "fr"].length - 1 && <span>|</span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="bottom-header">
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
                    {
                    notifications.length > 0 && (
                        <span className="notifications-number">
                            {notifications.length}
                        </span>
                    )
                }
                </div>
                
                {/* Dropdown menu for account */}
                {showAccountDrop && (
                <div className="accountDrop" onMouseLeave={() => setShowAccountDrop(false)}>
                    <a onClick={() => navigate(`/edit/${userData.username}`)}><FormattedMessage id="my_profile" /></a>
                    <a><FormattedMessage id="notification_label" /></a>
                    <a onClick={handleLogout}>Logout</a>
                </div>
                )}
            </div>
            </IntlProvider> 
        </header>
    );
};



export default Header;