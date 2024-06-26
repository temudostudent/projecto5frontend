import React , { useState, useEffect }  from 'react'
import { Button, Layout } from 'antd'
import FormTask from '../Forms/FormTask'
import EditProfileForm from '../Forms/EditProfileForm'
import Chat from '../../Pages/Chat'
import { useActionsStore } from '../../Stores/ActionStore'
import { IoClose } from "react-icons/io5";
import { useTaskStore } from '../../Stores/TaskStore'
import { useUsersListStore } from '../../Stores/UsersDataStore'
import './Sidebar.css'
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

function Sidebar({ formTitle, inputs, formSubmitTitle, onSubmit, userPath}) {

    // State variables and functions from the action store
    const updateShowSidebar = useActionsStore((state) => state.updateShowSidebar);
    const showSidebar = useActionsStore((state) => state.showSidebar);
    // Selected task and user from respective stores
    const { selectedTask } = useTaskStore();
    const { selectedUser } = useUsersListStore();
    // State variable to store initial values for form inputs
    const [initialValues, setInitialValues] = useState([]);
    // Get the current location
    const location = useLocation();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // useEffect hook to update initial values when selectedTask changes
    useEffect(() => {
        // Verifica se selectedTask mudou
        if (selectedTask !== initialValues) {
            setInitialValues(selectedTask);
        }
    }, [selectedTask]);
    
    // useEffect hook to update initial values when selectedUser changes
    useEffect(() => {
        // Verifica se selectedUser mudou
        if (selectedUser !== initialValues) {
            setInitialValues(selectedUser);
        }
    }, [selectedUser]);


    // Function to render the appropriate form component based on the location
    function renderComponent() {
        if (location.pathname === '/home' || location.pathname === '/alltasks') {
            return (
                <FormTask 
                    title={formTitle} 
                    inputs={inputs} 
                    buttonText={formSubmitTitle}
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                />
            );
        } else if (location.pathname === '/users') {
            return initialValues ? (
                <EditProfileForm 
                    username={initialValues.username}
                    printData={initialValues}
                    onUpdateSuccess={onSubmit}
                />
            ) : null;
        } else if (location.pathname === `/profile/${userPath}`) {
            return (
                <Chat 
                    receiverUsername={userPath}
                />
            );
        } else {
            return null;
        }
    }

      
    return (
        <Layout className='sidebar-container'>
            {/* Sidebar component */}
            <Sider 
                 width={location.pathname === `/profile/${userPath}` ? (windowWidth < 820 ? 400 : 500) : 300}
                style={{ height: '100%', backgroundColor: '#f6f5f7'}}
                collapsed={showSidebar}
                collapsedWidth={0}
                collapsible
                trigger={null}
                className='sidebar'>
                {/* Close button for the sidebar */}
                <Button onClick={()=>updateShowSidebar(!showSidebar)} className="close-button">
                    <IoClose />
                </Button>
                {/* Render the appropriate form component */}
                {renderComponent()}
            </Sider>
        </Layout>
    );
}

export default Sidebar;