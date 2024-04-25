import React, { useState, useEffect } from "react";
import logo from '../Assets/agileflow-high-resolution-logo-transparent.png'
import defaultPhoto from "../Assets/profile_pic_default.png"
import './CommonElements.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoMdNotificationsOutline } from "react-icons/io";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom'
import AuthService from "../Service/AuthService"
import NotificationService from "../Service/NotificationService"
import Menu from './Menu'
import { userStore } from '../../Stores/UserStore'
import { useActionsStore } from '../../Stores/ActionStore'
import { useCategoryStore } from '../../Stores/CategoryStore'
import { useTaskStore } from '../../Stores/TaskStore'
import { useUsersListStore } from '../../Stores/UsersDataStore'
import { useNotificationStore } from '../../Stores/NotificationStore';
import languages from "../../Translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";
import moment from 'moment';


const Header = () => {
    // Accessing state variables and functions from stores
    const { notifications, updateNotifications } = useNotificationStore();
    const {token, userData, locale, updateLocale} = userStore();
    const navigate = useNavigate();
    const [showAccountDrop, setShowAccountDrop] = useState(false);
    const [showNotificationDrop, setShowNotificationDrop] = useState(false);
    const [time, setTime] = useState(new Date());
    const [headerPhoto, setHeaderPhoto] = useState(defaultPhoto);
    const [selectedLanguage, setSelectedLanguage] = useState(locale);
    const { updateIsAllTasksPage } = useActionsStore();
    const [notificationCount, setNotificationCount] = useState(0);
   

    // Fetching user header data

    useEffect(() => {
        userHeaderData();
        console.log(userData);
        console.log("notifications", notifications);
    }, [token, userData.photoURL])

    useEffect(() => {
        const timer = setInterval(() => {
          setTime(new Date());
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

    useEffect(() => {
        const uniqueNotifications = {};
        if (Array.isArray(notifications)) {
            notifications.forEach(notification => {
                if (!notification.readStatus) {
                    uniqueNotifications[notification.sender.username] = notification;
                }
            });
        }
        console.log("notifications", uniqueNotifications);
        setNotificationCount(Object.keys(uniqueNotifications).length);
    }, [notifications]);


    const userHeaderData = async() => {
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
            useNotificationStore.getState().resetUseNotificationStore();
            navigate('/');
        }catch (error) {
            console.log(error);
        }
    }

    const handleClickLanguage = (language) => {
        updateLocale(language);
        setSelectedLanguage(language);
    }

    const handleClickNotification = async (senderUsername, receiverUsername) => {
        setShowNotificationDrop(false);
        await NotificationService.markAllFromSenderToReceiverAsRead(token, senderUsername, receiverUsername);
        
        let updatedNotifications = [];
        if (Array.isArray(notifications)) {
            updatedNotifications = notifications.map(notification => {
                if (notification.sender.username === senderUsername) {
                    console.log("notification", notification);
                    if (notification.type === 10) {
                        navigate(`/profile/${senderUsername}`);
                    }else {
                        navigate(`/home`);
                    }
                    return {
                        ...notification,
                        readStatus: true
                    };
                } else {
                    return notification;
                }
            });
        }
        
        updateNotifications(updatedNotifications);
    
        
    }

    const handleClickNotificationsNumber = async () => {
        await NotificationService.markAllNotificationsAsRead(token);
        
        let updatedNotifications = [];
        if (Array.isArray(notifications)) {
            updatedNotifications = notifications.map(notification => ({
                ...notification,
                readStatus: true
            }));
        }
        
        updateNotifications(updatedNotifications);
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
            path: "/users",
          
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
                <div className="time">
                    <FormattedMessage id="time" values={{t: time}} /> 
                </div>
                <div className="date">
                    <FormattedMessage id="date" values={{d: Date.now()}} /> 
                </div>
                <div className="language-select">
                    {["en", "pt", "fr"].map((language, index) => (
                        <React.Fragment key={language}>
                            <span className={selectedLanguage === language ? "selected" : ""} onClick={() => handleClickLanguage(language)}>
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
                <div className="profile-container" >
                    <IconContext.Provider value={{ color: "#4682A9", size: "2.7em", className: showNotificationDrop ? "notification-icon-selected" : "notification-icon"}}>
                        <span>
                            <IoMdNotificationsOutline onClick={() => {setShowNotificationDrop(!showNotificationDrop); setShowAccountDrop(false);}}/>
                        </span> {/* Show notifications icon */}
                    </IconContext.Provider>
                    {
                        notificationCount > 0 && (
                            <span className="notifications-number" title="Mark all as Read" onClick={() => handleClickNotificationsNumber(token)}>
                                {notificationCount}
                            </span>
                        )
                    }
                    <span className="photo-container" onClick={() => {setShowNotificationDrop(false); setShowAccountDrop(true);}}>
                        <img src={headerPhoto} alt="Profile Pic" /> {/* Show profile picture */}
                    </span>
                </div>
                
                {/* Dropdown menu for account */}
                {showAccountDrop && (
                <div className="accountDrop" onMouseLeave={() => setShowAccountDrop(false)}>
                    <a onClick={() => navigate(`/edit/${userData.username}`)}><FormattedMessage id="my_profile" /></a>
                    <a onClick={handleLogout}>Logout</a>
                </div>
                )}
                {/* Dropdown for notifications */}
                {showNotificationDrop && (
                    <div className="notificationDrop" >
                        <h3><FormattedMessage id="notification_label" /></h3>
                        {Array.isArray(notifications) && notifications.map((notification, index) => (
                            <div key={index} className="notification-container" onClick={() => handleClickNotification(notification.sender.username, userData.username)}>
                                <div className="photo-container">
                                    <img src={notification.sender.photoURL} alt="Sender Pic" />
                                </div>
                                <div className="message-container">
                                <p className="notification-text">
                                    <FormattedMessage 
                                        id={notification.type === 10 ? "notification_message" : "task_update_message"} 
                                        values={notification.type === 10 ? {user: notification.sender.username} : {user: notification.sender.username, taskName: notification.task.title}} 
                                    />
                                    </p>
                                    <p className="notification-moment">{moment(notification.timestamp).fromNow()}</p>
                                </div>
                                {!notification.readStatus && (
                                    <span className="unreaded-dot"></span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </IntlProvider> 
        </header>
    );
};



export default Header;