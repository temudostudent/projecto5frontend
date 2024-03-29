import React, { useState , useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useTaskStore } from '../../Stores/TaskStore'
import { useActionsStore } from '../../Stores/ActionStore'
import AuthService from '../../Components/Service/AuthService'
import Task from '../../Components/CommonElements/Task'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import  ModalInfo from '../CommonElements/ModalInfo'
import './ScrumBoard.css';

const ScrumBoard = (props) => {

  // Extracting location information from react-router-dom
  const location = useLocation();
  const { pathname } = location;

  // Destructuring props
  const { token , userData, homeTasksChange } = props;

  // Accessing state and functions from custom hooks
  const { tasks, updateTasks, setSelectedTask } = useTaskStore();
  const { updateShowSidebar, updateIsEditing, updateShowModal, showModal } = useActionsStore();

  // State variables
  const [loading, setLoading] = useState(true);
  const [selectedTaskInfo, setSelectedTaskInfo] = useState(null);
  const [currentTaskList, setCurrentTaskList] = useState([]);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      if (pathname === '/alltasks') {
        const userTasks = await AuthService.getAllTasks(token);
        updateTasks(userTasks);
      } else {
        const userTasks = await AuthService.getAllTasksFromUser(token, userData.username);
        updateTasks(userTasks);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };


  // useEffect to fetch tasks when token, userData, pathname, or homeTasksChange changes
  useEffect(() => {
    fetchTasks();
  }, [token, userData, pathname, homeTasksChange]);

  // useEffect to update currentTaskList whenever tasks change
  useEffect(() => {
    updateTaskList(tasks);
  }, [tasks]);


  // Function to update the currentTaskList state
  const updateTaskList = async (tasks) => {
    setCurrentTaskList(tasks);
  }
  

  // Function to handle changing the erase status of a task
  const handleTaskEraseStatus = async (taskId) => {
    try {
      
      await AuthService.changeEraseStatusTask(token, taskId);
      updateTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, erased: !task.erased};
          }
          return task;
        });
      });
      
    } catch (error) {
      console.error('Error changing task erase status:', error);
      setLoading(false);
    }
  };
  
  // Function to handle deleting a task
  const handleTaskDelete = async (taskId) => {
    try {
      
      await AuthService.deleteTask(token, taskId);
      updateTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
    } catch (error) {
      console.error('Error deleting task:', error);
      setLoading(false);
    }
  };


  // Function called when a task is dragged and dropped
  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
  
    try {
      const taskId = result.draggableId;
      const newStateId = parseInt(result.destination.droppableId);
  
      if (newStateId === parseInt(result.source.droppableId)) {
        return;
      }
  
      await AuthService.updateTaskStatus(token, taskId, newStateId);
  
      await updateTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, stateId: newStateId };
          }
          return task;
        });
      });

    } catch (error) {
      console.error('Error updating task status:', error);
      setLoading(false);
    }
  };


  // Function to handle the "New Task" button click
  const handleNewTaskButton = () => {
    updateShowSidebar(false);
    updateIsEditing(false);
    setSelectedTask(null);
  }

  // Function to handle double click on a task
  const handleTaskDoubleClick = (task) => {
    setSelectedTaskInfo(task);
    updateShowModal(true);
  };

  // Function to parse priority integer to string
  const parsePriorityToString = (priority) => {
    let newPriority = '';
    if(priority === 100) {
      newPriority = 'Low';
    } else if(priority === 200) {
      newPriority = 'Medium';
    } else if(priority === 300) {
      newPriority = 'High';
    }
    return newPriority;
  }

  // Function to parse stateId integer to string
  const parseStateIdToString = (stateId) => {
    let newStateId = '';
    if(stateId === 100) {
      newStateId = 'To Do';
    } else if(stateId === 200) {
      newStateId = 'Doing';
    } else if(stateId === 300) {
      newStateId = 'Done';
    }
    return newStateId;
  }

  // Function to render tasks based on their status
  const renderTasksByStatus = (status) => {
    // Filtering tasks based on status
    const filteredTasks =  Array.isArray(currentTaskList) ? currentTaskList.filter(task => task.stateId === parseInt(status)) : [];

    return (
      <Droppable droppableId={status} key={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`task_list ${status}`}
          >
            {filteredTasks.map((task, index) => (
              <Task 
                key={task.id} 
                task={task} 
                index={index} 
                onEraseStatusChange={handleTaskEraseStatus}
                onTaskDoubleClick={handleTaskDoubleClick}
                onDeleteChange={handleTaskDelete}
                className={task.erased ? 'erased-task' : ''}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <main>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <section className="scrum_section">
            <div className="column column1">
              <div className="title">To Do</div>
              { renderTasksByStatus("100")}

              {(location.pathname === '/home' || (location.pathname === '/alltasks' && userData.typeOfUser !== 100)) && (
                  <button onClick={handleNewTaskButton}>&nbsp;+ New Task</button>
              )}

             
            </div>

            <div className="column column2">
              <div className="title">Doing</div>
              {renderTasksByStatus("200")}
            </div>

            <div className="column column3">
              <div className="title">Done</div>
              {renderTasksByStatus("300")}
            </div>
          </section>
        </DragDropContext>
        
      )}

      {/* Modal for displaying task details */}
      {showModal && selectedTaskInfo && (
          <ModalInfo 
            title="Task Details"
            inputs={[
              { label: 'Title', type: 'textarea', value: selectedTaskInfo.title, disabled: true },
              { label: 'Description', type: 'textarea', value: selectedTaskInfo.description, disabled: true },
              { label: 'Start Date', type: 'text', value: selectedTaskInfo.startDate, disabled: true },
              { label: 'Limit Date', type: 'text', value: selectedTaskInfo.limitDate, disabled: true },
              { label: 'Owner', type: 'text', value: selectedTaskInfo.owner.username, disabled: true },
              { label: 'Category', type: 'text', value: selectedTaskInfo.category.name, disabled: true },
              { label: 'Priority', type: 'text', value: parsePriorityToString(selectedTaskInfo.priority), disabled: true },
              { label: 'Status', type: 'text', value: parseStateIdToString(selectedTaskInfo.stateId), disabled: true },
            ]}
          />
        )}

    </main>
  );
}

export default ScrumBoard;