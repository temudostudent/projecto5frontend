import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StatsService from '../Components/Service/StatsService';
import DoughnutChart from '../Components/Charts/DoughnutChart';
import SimpleLineChart from '../Components/Charts/SimpleLineChart';
import SimpleBarChart from '../Components/Charts/SimpleBarChart';
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
    
            setTasksCount(totalTasks);
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

      const tasksStatus =[
        { name: 'To Do', value: tasksCount.toDo, fill:'#c8ae7e44'  },
        { name: 'Doing', value: tasksCount.doing, fill:'#59a4b16b' },
        { name: 'Done', value: tasksCount.done, fill:'#4d7d9980' },
      ]

      //HARDCODED!!!!!!!!!!!!!!!!!!!!!!!!
      const userStatusStats =[
        { name: 'Confirmed', value: 7, fill:'#4682A9'  },
        { name: 'Not Confirmed', value: 2, fill:'#8fa6b1ad' },
      ];


    return (
        <Container fluid>
            <Row xs={1} md={3} lg={3} >
                <Col sm={12} md={4} lg={4} className="stat-container"> 
                    <p>Team Roles</p>
                    {usersCount.users > 0 && <StraightAnglePieChart data={teamRolesStats} total={usersCount.users} />}
                </Col>
                <Col sm={12} md={4} lg={4} className="stat-container">
                    <p>Users State</p>
                    <StraightAnglePieChart data={userStatusStats}/>
                </Col>
                <Col sm={12} md={4} lg={4} className="stat-container">
                    <p>Tasks Status</p>
                    {tasksCount.tasks > 0 && <StraightAnglePieChart data={tasksStatus} total={tasksCount.tasks}/>}
                </Col>
            </Row>
            <Row >
                <Col sm={6} md={6} lg={6} className="number-stat-container">
                    <p>Average Tasks per User</p>
                    {tasksCount.avgTasksPerUser}
                </Col>
                <Col sm={6} md={6} lg={6} className="number-stat-container">
                    <p>Average Task Time</p>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={2} >
                <Col className="line-stat-container">
                    Users over Time
                    <SimpleLineChart />
                </Col>
                <Col className="line-stat-container">
                    Tasks Done over Time
                    <SimpleLineChart />
                </Col>
            </Row>
            <Row xs={1} md={2} lg={2} >
                <Col className="bar-stat-container">
                    Categories
                    <SimpleBarChart/>
                </Col>
                <Col className="bar-stat-container">
                    User Status
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;