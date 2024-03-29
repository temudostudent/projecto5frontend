import React, {useEffect, useState } from "react";
import { userStore } from '../Stores/UserStore'
import { useUsersListStore } from '../Stores/UsersDataStore'
import { useActionsStore } from '../Stores/ActionStore'
import EnhancedTable from '../Components/CommonElements/Table'
import AuthService from '../Components/Service/AuthService'
import Sidebar from '../Components/CommonElements/Sidebar'

const Users = () => {
  const { token, userData } = userStore(); // Retrieve token and userData from userStore
  const { usersListData, updateUsersListData, setSelectedUser } = useUsersListStore(); // Get usersListData and updateUsersListData functions from useUsersListStore
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [selected, setSelected] = useState([]); // State to manage selected users
  const { showSidebar, updateShowSidebar } = useActionsStore(); // Get showSidebar and updateShowSidebar functions from useActionsStore

    // Function to handle users selection change
    const handleUsersSelectionChange = (selectedUsersIds) => {
      setSelected(selectedUsersIds); // Update selected users
    };

    // Define head cells for the table
    const headCells = [
        {
          id: 'photoURL',
          numeric: false,
          disablePadding: true,
          label: 'Profile Pic',
        },
        {
          id: 'username',
          numeric: false,
          disablePadding: true,
          label: 'Username',
        },
        {
            id: 'firstName',
            numeric: false,
            disablePadding: true,
            label: 'First Name',
        },
        {
            id: 'lastName',
            numeric: false,
            disablePadding: true,
            label: 'Last Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
        },
        {
            id: 'typeOfUser',
            numeric: false,
            disablePadding: true,
            label: 'Type Of User',
        },
        {
          id: 'number_tasks_user',
          numeric: true,
          disablePadding: false,
          label: '# Tasks',
        }
      ];

    // Define filter data for the table
    const filterData = [
        {
            id: 'all',
            numeric: false,
            label: 'All Users',
        },
        {
            id: 300,
            numeric: false,
            label: 'Product Owner',
        },
        {
            id: 200,
            numeric: false,
            label: 'Scrum Master',
        },
        {
            id: 100,
            numeric: false,
            label: 'Developer',
        },
        {
            id: 'active',
            numeric: false,
            label: 'Active',
        },
        {
            id: 'inactive',
            numeric: false,
            label: 'Inactive',
        },
    ];


    // Fetch users data on component mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers({});
            console.log(usersListData);
        };
    
        fetchData();
    }, []);
    
    // Function to fetch users based on filters
    const fetchUsers = async ({type, visible}) => {
      try {

          let usersList;

          if (type !== undefined) {
              usersList = await AuthService.getUsersByType(token, type);
          }else if (visible !== undefined) {
              usersList = await AuthService.getUsersByVisibility (token, visible);
          }else{
              usersList = await AuthService.getAllUsersData(token);
          }

          if (usersList !== undefined) {
              // Format users data and update usersListData
              const usersFormatted = await Promise.all(
                  usersList.map(async (user) => {
                      const tasks = await AuthService.getAllTasksFromUser(token, user.username);

                      const activeTasks = tasks.filter(task => task.erased === false);

                      const typeOfUserFormatted = formatTypeOfUser(user);

                      return { ...user, id:user.username, number_tasks_user: activeTasks.length, typeOfUser: typeOfUserFormatted};
                  })
              );
              
              await updateUsersListData(usersFormatted);

          } else {
              console.error('Error: Users data is undefined');
          }
          
          setLoading(false);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };

    // Function to format type of user
      const formatTypeOfUser = (userData) => {
        if (userData.typeOfUser === 100) {
            return 'Developer';
        } else if (userData.typeOfUser === 200) {
            return 'Scrum Master';
        } else if (userData.typeOfUser === 300) {
            return 'Product Owner';
        }
      };

       // Function to handle edit button click
      const handleEditButton = async () => {
        setSelectedUser(await AuthService.getUserData(token, selected[0]));
        updateShowSidebar(false);
      }

      // Function to handle users visibility change
      const handleUsersVisibility = async () => {
        try {
          await Promise.all(
            selected.map(async (username) => {
              await AuthService.updateVisibility(token, username);
            })
          );
          await fetchUsers({});

            } catch (error) {
            console.error('Error deleting categories:', error);
            }
      };

      // Function to handle deleting all tasks of selected users
      const handleUsersDeleteAllTasks = async () => {
        try {
          await Promise.all(
            selected.map(async (username) => {
              await AuthService.eraseAllTasksFromUser(token, username);
            })
          );
      
          await fetchUsers({});

            } catch (error) {
            console.error('Error deleting categories:', error);
            }
      };

       // Function to handle permanently deleting selected users
      const handleUsersPermDelete = async () => {
        try {
            await Promise.all(
              selected.map(async (username) => {
                await AuthService.deleteUser(token, username);
              })
            );
        
            await fetchUsers({});
  
              } catch (error) {
              console.error('Error deleting categories:', error);
              }
      };


      // Function to handle filter list
      const handleFilterList = async (id) => {

        if (id ==='all'){ await fetchUsers({});

        } else if(id==='active') {  await fetchUsers({visible: true});

        } else if(id==='inactive') { await fetchUsers({visible: false});

        }  else { await fetchUsers({type: id});

        }
      };


      // Function to handle update success
      const handleUpdateSuccess = async (inputs, username) => {

        console.log(inputs);

        try {
          const updateResponse = await AuthService.updateUser(token, username, inputs);
      
          if (updateResponse) {
  
            await fetchUsers({});
            updateShowSidebar(true);
            setSelectedUser(null);
        
          } else {
           
            console.error("Update unsuccessful:", updateResponse);
          }
        } catch (error) {
          
          console.error("Error updating profile:", error);
        }
  
      };


    // Define inputs for the sidebar form
      const inputs = [
        { type: 'text', name: 'firstName' },
        { type: 'text', name: 'lastName' },
        { type: 'text', name: 'email' },
        { type: 'text', name: 'phone' },
        { type: 'url', name: 'photoURL' },
        { 
            type: 'select', 
            name: 'typeOfUser', 
            required: true,
            options: [
            { value: '', label: 'Type', disabled: true},
            { value: 300, label: 'Product Owner' },
            { value: 200, label: 'Scrum Master' },
            { value: 100, label: 'Developer' }
            ]
        },
        
    ];



    // Render the Users component
    return (
        <div className={`container-users ${showSidebar ? 'sidebar-active' : 'sidebar-inactive'}`}>
            <div className="sidebar-container">
                <Sidebar
                    collapsedWidth={showSidebar ? '100%' : '0'}
                    formTitle={'Edit User'} 
                    inputs={inputs}
                    formSubmitTitle={'Save Changes'}
                    onSubmit={handleUpdateSuccess}
                />
            </div>
            <div className={`table-container ${showSidebar ? 'table-expanded' : ''}`}>
            {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <EnhancedTable 
                            dataType="Users"
                            typeOfUser={userData.typeOfUser}
                            headCells={headCells}
                            data={usersListData}
                            filterData={filterData}
                            handleFilter={handleFilterList}
                            onSelectionChange={handleUsersSelectionChange}
                            onDeleteSelected={handleUsersDeleteAllTasks}
                            onChangeVisibilitySelect={handleUsersVisibility}
                            onPermDeleteSelect={handleUsersPermDelete}
                            onEditSelect={handleEditButton}
                            />
                    </>
                )}
            </div>
        </div>
    );

}

export default Users;