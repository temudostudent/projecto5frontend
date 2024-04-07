import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE_URL = 'http://localhost:8080/project_backend/rest/users';

const AuthService = {

/*----------------------
USER
----------------------*/

// Function to handle user login
    login: async (inputs) => {

        try{
            const response = await axios.post(`${API_BASE_URL}/login`, inputs, 
            {
                headers: 
                {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                return response;
            } else if (response.status === 401) {
                toast.warning("Invalid credentials, please try again");
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("An error occurred, please try again later.");
        };
    },

    // Function to handle user logout
    logout: async (token) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/logout`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response.status === 200) {
                sessionStorage.clear();
                toast.success('Logout Success');
            } else {
                toast.warning(response.status)
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    },

    // Function to handle user registration
    register: async (inputs) => {

        try{
            const response = await axios.post(`${API_BASE_URL}/register`, inputs, 
            {
                headers: 
                {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {

                toast.success("Thanks for being awesome! Account registered successfully!");
                return response;

            }else {
                    const errorData = await response.statusText();

                    switch (response.status) {
                        case 422:
                            switch (errorData) {
                                case "There's an empty field, fill all values":
                                    toast.error("Please fill all fields");
                                    break;
                                case "Invalid email":
                                    toast.error("The email you used is not valid");
                                    break;
                                case "Invalid phone number":
                                    toast.error("The phone number is not valid");
                                    break;
                                default:
                                    console.error('Unknown error message:', errorData);
                                    toast.error("Something went wrong");
                            }
                            break;
                        case 409: 
                            toast.error("Username already in use");
                            break;
                        default:
                            console.log('Unknown error message:', errorData);
                            toast.error("Something went wrong");
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error("Something went wrong");
            }
        },

    // Function to handle user reset password
    forgotPassword: async (inputs) => {

        try{
            const response = await axios.post(`${API_BASE_URL}/forgotPassword`, inputs, 
            {
                headers: 
                {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                toast.success("We have sent you an email with further instructions");
                return response;
            } else if (response.status === 401) {
                toast.error("Email not registed");
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("An error occurred, please try again later.");
        };
    },


    // Function to get user data
    getUserData: async (token , username) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                return response.data;
      
              } else if (response.status === 401) {
                toast.warning("Invalid credentials")
              } else {
                toast.warning("Invalid username on path")
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },


    // Function to get username
    getUsername: async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getUsername`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                return response.data;
      
              } else if (response.status === 401) {
                  toast.warning("Invalid credentials")
              }
        } catch (error) {
            console.error('Error getting username:', error);
        }
    },


    // Function to get photo
    getPhoto: async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getPhotoUrl`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                return response.data;
      
              } else if (response.status === 401) {
                  toast.warning("Invalid credentials")
              }
        } catch (error) {
            console.error('Error:', error);
        }

    },

    // Function to update user
    updateUser: async (token, username, updatedData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update/${username}`, updatedData, {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'token': token
                }
            });

            console.log(response);

            if (response.status === 200) {

                toast.success("Profile updated successfully");
       
                return response;
      
            } else if (response.status === 401) {
                toast.warning("Invalid credentials")
                return response;
            } else if (response.status == 422) {
                toast.warning(response.statusText);
                return response;
            } else {
                console.error("Unhandled status code:", response.status);
                return response;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

/*----------------------
CATEGORIES
----------------------*/

    // Function to get all categories
    getAllCategories: async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                return response.data;
      
              } else if (response.status === 401) {
                toast.warning("Invalid credentials")
              } else if (response.status === 404) {
                toast.warning('Something went wrong. The categories were not found.')
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    // Function to edit category
    editCategory: async (token, oldName, newName) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/editCategory/${oldName}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token,
                    'newCategoryName': newName
                }
            });
            if (response.status === 200) {
       
                toast.success("Task edited successfully")
                return response;
      
              } else if (response.status === 401) {
                toast.warning("Invalid credentials")
              } else if (response.status === 404) {
                toast.warning("Impossible to edit task. Verify all fields")
              }else if (response.status === 403) {
                toast.warning("You don't have permission to edit a category")
              } else {
                toast.warning("Category not created. Something went wrong")
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },


    // Function to delete category
    deleteCategory: async (token, categoryId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteCategory/id/${categoryId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                toast.success("Category deleted successfully")
                return response;
      
              } else if (response.status === 400) {
                toast.warning("Category with this name can't be deleted while it has tasks associated")
                console.log('banaan');
              } else if (response.status === 403) {
                toast.warning("You don't have permission to delete a category")
              } else if (response.status === 404) {
                toast.warning("Category with this name not found")
              } else if (response.status === 401) {
                toast.warning("Invalid credentials")
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },


    // Function to create new category
    newCategory: async (token, input) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/newCategory`, input,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token
                }
            });
            if (response.status === 201) {
       
                toast.success("Task created successfully")
                return response;
      
              } else if (response.status === 403) {
                toast.warning("You don't have permission to create a category")
              } else if (response.status === 404) {
                toast.warning("Impossible to create task. Verify all fields")
              }else if (response.status === 409) {
                toast.warning("Category already exists")
              } else {
                toast.warning("Category not created. Something went wrong")
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },


    // Function to get tasks by category
    getTasksByCategories: async (token, categoryName) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tasks/${categoryName}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'token': token
                }
            });
            if (response.status === 200) {
       
                return response.data;
      
              } else if (response.status === 401) {
                toast.warning("Invalid credentials")
              } else if (response.status === 403) {
                toast.warning("You don't have permission for this request")
              }
        } catch (error) {
            console.error('Error:', error);
        }
    },

/*----------------------
TASKS
----------------------*/


// Function to get all tasks
getAllTasks: async (token) => {

    console.log('getAllTasks');

    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to get all tasks from a user
getAllTasksFromUser: async (token, username) => {

    console.log('getAllTasksFromUser');
    try {
        const response = await axios.get(`${API_BASE_URL}/${username}/tasks`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token,
                'username': username
            }
        });
        if (response.status === 200) {

            console.log(response);
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 406) {
            toast.warning("Unauthorized access")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to get all tasks by category
getAllTasksByCategory: async (token, categoryName) => {

    console.log('getAllTasksByCategory', categoryName);


    try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${categoryName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            console.log(response);
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 403) {
            toast.warning("You don't have permission for this request")
          }
    } catch (error) {
        console.error('Error fetch tasks by category:', error);
    }
},


// Function to get all tasks by erased status
getAllTasksByErasedStatus: async (token, erasedStatus) => {


    try {
        const response = await axios.get(`${API_BASE_URL}/erasedTasks/?erased=${erasedStatus}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });

        console.log(response);

        if (response.status === 200) {
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 403) {
            toast.warning("You don't have permission for this request")
          }
    } catch (error) {
        console.error('Error fetch tasks by erased status:', error);
    }
},


// Function to add new task
newTask: async (token, username, task) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${username}/addTask`, task, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 201) {
   
            toast.success("New task added successfully")
            return response;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 404) {
            toast.warning("Impossible to create task. Verify all fields")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to update task state
updateTaskStatus: async (token, taskId, newStateId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/${newStateId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {

            toast.success('Task status updated')
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 404) {
            toast.warning("Impossible to update task status. Task not found or invalid status")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to change erase status of a task
changeEraseStatusTask: async (token, taskId) => {

    console.log('change erase status task');


    try {
        const response = await axios.put(`${API_BASE_URL}/${taskId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });

        console.log(response);

        if (response.status === 200) {
   
            toast.success(response.data)
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 403) {
            toast.warning("You don't have permission to erase a task")
          } else if (response.status === 404) {
            toast.warning("Task with this id is not found")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to delete a task
deleteTask: async (token, taskId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete/${taskId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            toast.success("Task deleted successfully")
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 403) {
            toast.warning("You don't have permission to delete a task")
          } else if (response.status === 404) {
            toast.warning("Task with this id is not found")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to edit a task
editTask: async (token, taskId, inputs) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updatetask/${taskId}`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
            toast.success('Task status updated')
            return response;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 404) {
            toast.warning("Impossible to update task. Verify all field")
          } else if (response.status === 403){
            toast.warning("You don't have permission to update this task");
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


/*----------------------
ALL USERS
----------------------*/


// Function to get all users' data
getAllUsersData: async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to get users by visibility
getUsersByVisibility: async (token, visible) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all/visible/${visible}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to get users by type
getUsersByType: async (token, type) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all/${type}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            return response.data;
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to update user visibility
updateVisibility: async (token, username) => {

    try {
        const response = await axios.put(`${API_BASE_URL}/update/${username}/visibility`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
            toast.success('User visibility updated')
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},


// Function to erase all tasks from a user
eraseAllTasksFromUser: async (token, username) => {

    try {
        const response = await axios.put(`${API_BASE_URL}/eraseAllTasks/${username}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
            toast.success('All tasks were erased successfully')
  
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          } else if (response.status === 403) {
            toast.warning("You don't have permission to erase these tasks")
          } else if (response.status === 404) {
            toast.warning("Something went wrong. The tasks were not erased.")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},

// Function to delete a user
deleteUser: async (token, username) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${username}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'token': token
            }
        });
        if (response.status === 200) {
   
            toast.success("User deleted successfully")
            return response;
  
          } else if (response.status === 404) {
            toast.warning("User with this name not found")
          } else if (response.status === 401) {
            toast.warning("Invalid credentials")
          }
    } catch (error) {
        console.error('Error:', error);
    }
},

};

export default AuthService;