import React, { useState , useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../Components/Service/AuthService'
import ScrumBoard from '../Components/MainScrum/ScrumBoard'
import { userStore } from '../Stores/UserStore'
import { useUsersListStore } from '../Stores/UsersDataStore'
import { useTaskStore } from '../Stores/TaskStore'
import { useActionsStore } from '../Stores/ActionStore'
import { useCategoryStore } from '../Stores/CategoryStore'
import Sidebar from '../Components/CommonElements/Sidebar'
import languages from "../Translations"; 
import { IntlProvider, FormattedMessage } from "react-intl"; 
import Header from '../Components/CommonElements/Header'

const Home = () => {

    const location = useLocation(); // Get current location

    // Destructure values from stores
    
    const navigate = useNavigate();
    const {token, userData, locale} = userStore();
    const { categories, updateCategories } = useCategoryStore();
    const { usersListData, updateUsersListData } = useUsersListStore();
    const { updateTasks, selectedTask, setSelectedTask } = useTaskStore();
    const { showSidebar, updateShowSidebar, isEditing } = useActionsStore();

    // State variables
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedOption, setSelectedOption] = useState('');
    const [updatedSignal, setUpdatedSignal] = useState(true);


    // Fetch initial data on component mount
    useEffect(() => {
        fetchInitialData();

        if (!token) {
            // Se o token não existir ou não for válido, redirecionar para uma página de erro
            navigate('/404');
        }
    }, []);

    useEffect(() => {
        updateShowSidebar(true);
    }, [location.pathname]);

    

    // Function to fetch initial data (categories, users, tasks)
    const fetchInitialData = async () => {
        try {
            await Promise.all([fetchCategories(), fetchUsers()]);
            setLoading(false); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); 
        }
    };

     // Function to fetch tasks based on category, erasedStatus, or user
    const fetchTasks = async (categoryName , erasedStatus, username) => {

        let userTasks;
        
        try {
            if (location.pathname === '/alltasks') {

                if (categoryName) {
                    userTasks = await AuthService.getAllTasksByCategory(token, categoryName);
                    
                } else if (erasedStatus=== true || erasedStatus=== false) {
                    userTasks = await AuthService.getAllTasksByErasedStatus(token, erasedStatus);
                } else if (username){
                    userTasks = await AuthService.getAllTasksFromUser(token, username);
                } else {
                    userTasks = await AuthService.getAllTasks(token);
                }
            } else {

                userTasks = await AuthService.getAllTasksFromUser(token, userData.username);
            }
    
            updateTasks(userTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    // Function to fetch categories
    const fetchCategories = async () => {
        const allCategories = await AuthService.getAllCategories(token);
        updateCategories(allCategories);
    };

    // Function to fetch users data
    const fetchUsers = async () => {
        const allUsers = await AuthService.getAllUsersData(token);
        updateUsersListData(allUsers);
    };

    // Function to handle task creation
    const handleCreateTask = async (taskInput) => {
       
        try {  
            const response = await AuthService.newTask(token, userData.username, taskInput);

            if (response.status === 201) {
                
                /* Retirada do fetch tasks, já estava a ser chamado */
                setUpdatedSignal(!updatedSignal);
                updateShowSidebar(true);
            } else {
                console.error('Error creating task:', response.error);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };


    // Function to handle task editing
    const handleEditTask = async (taskInput) => {

        try {
            
            const response = await AuthService.editTask(token, selectedTask.id, taskInput);

            if (response.status === 200) {
                
                
                updateShowSidebar(true);
                setSelectedTask(null);
                setUpdatedSignal(!updatedSignal);
            } else {
                console.error('Error creating task:', response.error);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };
    

    // Array of input fields for task form
    const inputs = [
        { 
            type: 'select', 
            name: 'category', 
            required: true,
            options: [
                { value: '', label: <FormattedMessage id="category" />, disabled: true, categoryId: null},
                ...(categories ? categories.map(category => ({ value: category.name, label: category.name, categoryId: category.id})) : [])
              ]
        },
        { type: 'text', name: 'title', placeholder: 'Title', required: true },
        { type: 'textarea', name: 'description', placeholder: 'Description', required: true },
        { 
            type: 'select', 
            name: 'priority', 
            required: true,
            options: [
            { value: '', label: <FormattedMessage id="priority" />, disabled: true},
            { value: 300, label: <FormattedMessage id="high" /> },
            { value: 200, label: <FormattedMessage id="medium" /> },
            { value: 100, label: <FormattedMessage id="low" /> }
            ]
        },
        { type: 'date', label: <FormattedMessage id="start" />, name: 'startDate', required: true },
        { type: 'date', label: <FormattedMessage id="end" />, name: 'limitDate' },
        
    ];

    // Function to handle filter change
    const handleFilterChange = async (event) => {
        const selectedValue = event.target.value;

        setSelectedFilter(selectedValue);
        setSelectedOption('');
      
        if (selectedValue === 'All') {
          fetchTasks();
        }
      };


      // Function to handle option change based on selected filter
      const handleOptionChange = (event) => {
        const selectedOptionValue = event.target.value;
        setSelectedOption(selectedOptionValue);
        switch (selectedFilter) {
            case 'State':
                if (selectedOptionValue === 'Active') {
                    fetchTasks('', false);
                }else {
                    fetchTasks('', true);
                }
                break;
            case 'Categories':
                if (selectedOptionValue !== '') {
                    fetchTasks(selectedOptionValue);
                }
                break;
            case 'Users':
                if (selectedOptionValue !== '') {
                    fetchTasks('', '', selectedOptionValue);
                }
                break;
            default:
                break;
        }
    };


    // Function to render select filter dropdown
    const renderSelect = ({ name }) => {
        return (
            <div className='select-container'>
                <IntlProvider locale={locale} messages={languages[locale]}> 
                <select name={name} onChange={handleFilterChange} value={selectedFilter}>
                <option value="All"><FormattedMessage id="all" /></option>
                    <option value="State"><FormattedMessage id="state" /></option>
                    <option value="Categories"><FormattedMessage id="categories" /></option>
                    <option value="Users"><FormattedMessage id="users" /></option>
                </select>

                {selectedFilter === 'State' && (
                    <select onChange={handleOptionChange} value={selectedOption}>
                    <option value="" disabled><FormattedMessage id="select_state" /></option>
                    <option value="Active"><FormattedMessage id="active" /></option>
                    <option value="Erased"><FormattedMessage id="erased" /></option>
                    </select>
                )}

                {selectedFilter === 'Categories' && (
                    <select onChange={handleOptionChange} value={selectedOption}>
                    <option value="" disabled><FormattedMessage id="select_category" /></option>
                    {categories.map((category, index) => (
                        <option key={index} value={category.name} data-category-id={category.id}>
                        {category.name}
                        </option>
                    ))}
                    </select>
                )}

                {selectedFilter === 'Users' && (
                    <select onChange={handleOptionChange} value={selectedOption}>
                    <option value="" disabled><FormattedMessage id="select_user" /></option>
                    {usersListData.map((user, index) => (
                        <option key={index} value={user.username} data-category-id={user.username}>
                        {user.username}
                        </option>
                    ))}
                    </select>
                )}
                </IntlProvider> 
                </div>
            );
        };


    return (
        <>
        <Header 
        selectedFilter={selectedFilter}
        selectedOption={selectedOption}
        />
        <div className='Home'>
            <IntlProvider locale={locale} messages={languages[locale]}> 
            {!loading && (
                <div className={`container-home ${showSidebar ? 'sidebar-active' : 'sidebar-inactive'}`}>
                    <div className="sidebar-container">
                    <Sidebar
                        collapsedWidth={showSidebar ? '100%' : '0'}
                        formTitle={isEditing ? <FormattedMessage id="edit_task" /> : <FormattedMessage id="add_task" />} 
                        inputs={inputs}
                        formSubmitTitle={isEditing ? <FormattedMessage id="save_changes" /> : <FormattedMessage id="submit" />}
                        onSubmit={isEditing ? handleEditTask : handleCreateTask}
                    />
                    </div>
                    <div className='right-home-container'>
                        <div className={`scrum-board-container ${showSidebar ? 'scrum-board-expanded' : ''}`}>
                            <ScrumBoard
                                token={token}
                                userData={userData}
                                homeTasksChange={updatedSignal}
                                
                            />
                        </div>
                        <div className='select-filter-container'>
                            {(location.pathname === '/alltasks') && (userData.typeOfUser!==100) && (
                                    renderSelect({ name: 'Filters' })
                            )}
                            
                        </div>
                    </div>
                </div>
            )}
            {loading && <div>Loading...</div>}
            </IntlProvider> 
        </div>
        </>
        
    );
};

export default Home;