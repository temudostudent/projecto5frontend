import React, {useState, useEffect} from "react";
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import SimpleLineChart from '../Components/Charts/SimpleLineChart';
import SimpleBarChart from '../Components/Charts/SimpleBarChart';
import StraightAnglePieChart from '../Components/Charts/StraightAnglePieChart';
import { userStore } from '../Stores/UserStore'
import { useCategoryStore } from '../Stores/CategoryStore'
import AuthService from '../Components/Service/AuthService'
import languages from "../Translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const Dashboard = () => {
    const {token, locale} = userStore();
    const [tasksCount, setTasksCount] = useState([]);
    const [usersCount, setUsersCount] = useState([]);
    const { categories, updateCategories} = useCategoryStore();
    

    useEffect(() => {
        const fetchStats = async () => {
          try{
            const totalTasks = await StatsService.getCountTasks(token, null, null);
            const totalUsers = await StatsService.getCountUsers(token, null);
    
            console.log("tasks", totalTasks);
            console.log("users", totalUsers);
    
            setTasksCount(totalTasks);
            setUsersCount(totalUsers);
          }catch (error) {
            console.error("Error fetching statistics:", error);
          }
        };
    
        fetchStats();
        fetchCategories();
    }, [token]);

    // Function to fetch categories and update state
    const fetchCategories = async () => {
        try {
            const allCategories = await AuthService.getAllCategories(token);
            
            // Check if allCategories is not undefined before mapping over it
            if (allCategories !== undefined) {
                const categoriesWithTasks = await Promise.all(
                    allCategories.map(async (category) => {
                        const tasks = await AuthService.getTasksByCategories(token, category.name);
                        return { ...category, number_tasks: tasks.length };
                    })
                );
                
                updateCategories(categoriesWithTasks);
                console.log(categoriesWithTasks);
            } else {
                console.error('Error: Categories data is undefined');
            }
        
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };
    
    //Info formatada para mostrar as legendas pretendidas
    const teamRolesStats =[
    { name: 'Developer', value: usersCount.devs, fill:'#91C8E4'  },
    { name: 'Scrum Master', value: usersCount.scrumMasters, fill:'#749BC2' },
    { name: 'Product Owner', value: usersCount.productOwners, fill:'#4682A9' },
    ];

    const tasksStatus =[
    { name: 'To Do', value: tasksCount.toDo, fill:'#c8ae7e44'  },
    { name: 'Doing', value: tasksCount.doing, fill:'#59a4b16b' },
    { name: 'Done', value: tasksCount.done, fill:'#4d7d9980' },
    ];

    const userStatusStats =[
    { name: 'Confirmed', value: usersCount.confirmedUsers, fill:'#4682A9'  },
    { name: 'Not Confirmed', value: usersCount.notConfirmedUsers, fill:'#8fa6b1ad' },
    ];

    const formatUsersOverTime = (usersCount) => {
        if (!usersCount || !usersCount.usersByTime) {
            return [];
        }

        let usersByTime = usersCount.usersByTime;
        let keys = Object.keys(usersByTime);
        let usersOverTime = [];

        keys.forEach(key => {
            let year = key.substring(0, 4);
            let dayMonth = key.substring(5).split('-').reverse().join('-');
            let value = usersByTime[key]; 

        usersOverTime.push({ name: dayMonth, Users: value });
        });

        return usersOverTime;
    }

    const formatTasksOverTime = (tasksCount) => {
        if (!tasksCount || !tasksCount.tasksDoneByTime) {
            return [];
        }

        let tasksDoneByTime = tasksCount.tasksDoneByTime;
        let keys = Object.keys(tasksDoneByTime);
        let tasksOverTime = [];

        keys.forEach(key => {
            let year = key.substring(0, 4);
            let dayMonth = key.substring(5).split('-').reverse().join('-');
            let value = tasksDoneByTime[key]; 

            tasksOverTime.push({ name: dayMonth, Tasks: value });
        });

        return tasksOverTime;
    }

    let formattedCategoriesWithTasks = categories.map(({ number_tasks, ...category }) => ({
        ...category,
        'Number of Tasks': number_tasks
    }));

    

    return (
        <div className="dashboard-container">
            <IntlProvider locale={locale} messages={languages[locale]}> 
            <div className="container">
                <div className="row1">
                    <div className="col">
                        <h3><FormattedMessage id="team-roles" /></h3>
                        {usersCount.users > 0 && <StraightAnglePieChart data={teamRolesStats} total={usersCount.users} />}
                    </div>
                    <div className="col">
                        <h3><FormattedMessage id="users-state" /></h3>
                        {usersCount.users > 0 && <StraightAnglePieChart data={userStatusStats} total={usersCount.confirmedUsers+usersCount.notConfirmedUsers} />}
                    </div>
                    <div className="col">
                        <h3><FormattedMessage id="tasks-status" /></h3>
                        {tasksCount.tasks > 0 && <StraightAnglePieChart data={tasksStatus} total={tasksCount.tasks}/>}
                    </div>
                </div>
                <div className="row2">
                    <div className="col">
                        <h3><FormattedMessage id="avg-tasks" /></h3>
                        <span className="stat-number">{tasksCount.avgTasksPerUser}</span>
                    </div>
                    <div className="col">
                        <h3><FormattedMessage id="avg-tasks-time" /></h3>
                        <span className="stat-number">{tasksCount.avgTaskDone}</span>
                    </div>
                </div>
                <div className="row3">
                    <div className="col">
                        <h3><FormattedMessage id="users-over-time" /></h3>
                        <SimpleLineChart data={formatUsersOverTime(usersCount)} users/>
                    </div>
                    <div className="col">
                        <h3><FormattedMessage id="tasks-done-over-time" /></h3>
                        <SimpleLineChart data={formatTasksOverTime(tasksCount)}/>
                    </div>
                </div>
                <div className="row4">
                    <div className="col">
                        <h3><FormattedMessage id="categories" /></h3>
                        <SimpleBarChart data={formattedCategoriesWithTasks}/>
                    </div>
                    <div className="col">
                        <h3><FormattedMessage id="user-status" /></h3>
                    </div>
                </div>
            </div>
            </IntlProvider> 
        </div>
    );
}

export default Dashboard;