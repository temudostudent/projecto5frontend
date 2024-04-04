import React, {useState, useEffect} from "react";
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import StraightAnglePieChart from '../Components/Charts/StraightAnglePieChart';
import { userStore } from '../Stores/UserStore'

const Dashboard = () => {
    const token = userStore((state) => state.token);
    const [tasksCount, setTasksCount] = useState([]);
    const [usersCount, setUsersCount] = useState([]);
    

    useEffect(() => {
        const fetchStats = async () => {
          try{
            const totalTasks = await StatsService.getCountTasks(token, null, null);
            const totalUsers = await StatsService.getCountUsers(token, null);
    
            console.log("tasks", totalTasks);
            console.log("users", totalUsers);
    
            setTasksCount(tasksCount);
            setUsersCount(totalUsers);
          }catch (error) {
            console.error("Error fetching statistics:", error);
          }
        };
    
        fetchStats();
      }, [token]);
    
      //Info formatada para mostrar as legendas pretendidas
      const teamRolesStats =[
        { name: 'Developer', value: usersCount.devs, fill:'#91C8E4'  },
        { name: 'Scrum Master', value: usersCount.scrumMasters, fill:'#749BC2' },
        { name: 'Product Owner', value: usersCount.productOwners, fill:'#4682A9' },
      ];

      //HARDCODED
      const userStatusStats =[
        { name: 'Confirmed', value: 7, fill:'#4682A9'  },
        { name: 'Not Confirmed', value: 2, fill:'#8fa6b1ad' },
      ];


    return (
        <div className="dashboard-body">
            <h1>Dashboard</h1>
            <div className="charts-containers">

                <div className="chart-div sector1">
                    <span>
                        <p>Team Roles</p>
                        {usersCount.users > 0 && <StraightAnglePieChart data={teamRolesStats} total={usersCount.users} />}
                    </span>
                    <span>
                        <p>Users State</p>
                        <StraightAnglePieChart data={userStatusStats}/>
                    </span>
                </div>
                <div className="chart-div sector2">
                    <span>
                        <p>Average Tasks per User</p>
                        30
                    </span>
                    <span>
                        <p>Average Task Time</p>
                    </span>
                </div>
                <div className="chart-div">
                    
                </div>
                <div className="chart-div">
                    <p>Tasks Status</p>
                </div>
                <div className="chart-div">
                    <p>Categories</p>
                </div>
                <div className="chart-div">
                    <p>User Status</p>
                </div>

                <div className="chart-div">
                    <p>Users over Time</p>
                </div>
                <div className="chart-div">
                    <p>Tasks over Time</p>
                </div>
            </div>
            
        </div>
    );
}

export default Dashboard;