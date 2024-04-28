import React, { useState , useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { userStore } from '../../Stores/UserStore'
import { useTaskStore } from '../../Stores/TaskStore'
import { useActionsStore } from '../../Stores/ActionStore'
import AuthService from '../../Components/Service/AuthService'
import Task from '../../Components/CommonElements/Task'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import  ModalInfo from '../CommonElements/ModalInfo'
import './ScrumBoard.css';
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../Translations";

const ScrumBoard = (props) => {

  // Destructuring props
  const { token , userData, homeTasksChange } = props;

  // Extracting location information from react-router-dom
  const {pathname} = useLocation();

  // Accessing state and functions from custom hooks
  const { tasks, updateTasks, setSelectedTask } = useTaskStore();
  const { updateShowSidebar, updateIsEditing, updateShowModal, showModal } = useActionsStore();
  const {locale} = userStore();

  // State variables
  const [loading, setLoading] = useState(true);
  const [selectedTaskInfo, setSelectedTaskInfo] = useState(null);
  const [currentTaskList, setCurrentTaskList] = useState([]);
  const [isWindowSmall, setIsWindowSmall] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => {
      setIsWindowSmall(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);

    // Limpeza na desmontagem
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect to fetch tasks when token, userData, pathname, or homeTasksChange changes
  useEffect(() => {
    fetchTasks();
  }, [token, userData, pathname, homeTasksChange]);

  // useEffect to update currentTaskList whenever tasks change
  useEffect(() => {
    updateTaskList(tasks);
  }, [tasks]);

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
      newPriority = <FormattedMessage id="low" />;
    } else if(priority === 200) {
      newPriority = <FormattedMessage id="medium" />;
    } else if(priority === 300) {
      newPriority = <FormattedMessage id="high" />;
    }
    return newPriority;
  }

  // Function to parse stateId integer to string
  const parseStateIdToString = (stateId) => {
    let newStateId = '';
    if(stateId === 100) {
      newStateId = <FormattedMessage id="to_do" />;
    } else if(stateId === 200) {
      newStateId = <FormattedMessage id="doing" />;
    } else if(stateId === 300) {
      newStateId = <FormattedMessage id="done" />;
    }
    return newStateId;
  }

  const slide = (direction) => {
    const slider = document.querySelector('.slider-container');
    if (slider) {
      console.log(slider.clientWidth);
      const scrollAmount = slider.clientWidth;
      slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    } else {
      console.error('Slider element not found');
    }
  };

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
      <IntlProvider locale={locale} messages={languages[locale]}> 
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <section className="scrum_section">
          
            <div className="column column1">
              <div className="title"><FormattedMessage id="to_do" /></div>
              { renderTasksByStatus("100")}

              {(pathname === '/home' || (pathname === '/alltasks' && userData.typeOfUser !== 100)) && (
                  <button onClick={handleNewTaskButton}>&nbsp;<FormattedMessage id="add_new_task" /></button>
              )}

             
            </div>

            <div className="column column2">
              <div className="title"><FormattedMessage id="doing" /></div>
              {renderTasksByStatus("200")}
            </div>

            <div className="column column3">
              <div className="title"><FormattedMessage id="done" /></div>
              {renderTasksByStatus("300")}
              
            </div>
          </section>
        </DragDropContext>
      )}

      {isWindowSmall && (
        <>
          
        </>
      )}
      

      {/* Modal for displaying task details */}
      {showModal && selectedTaskInfo && (
          <ModalInfo 
            title = {<FormattedMessage id="task_details" />}
            inputs={[
              { label: <FormattedMessage id="title" />, type: 'textarea', value: selectedTaskInfo.title, disabled: true },
              { label: <FormattedMessage id="description" />, type: 'textarea', value: selectedTaskInfo.description, disabled: true },
              { label: <FormattedMessage id="start_date" />, type: 'text', value: selectedTaskInfo.startDate, disabled: true },
              { label: <FormattedMessage id="limit_date" />, type: 'text', value: selectedTaskInfo.limitDate, disabled: true },
              { label: <FormattedMessage id="owner" />, type: 'text', value: selectedTaskInfo.owner.username, disabled: true },
              { label: <FormattedMessage id="category" />, type: 'text', value: selectedTaskInfo.category.name, disabled: true },
              { label: <FormattedMessage id="priority" />, type: 'text', value: parsePriorityToString(selectedTaskInfo.priority), disabled: true },
              { label: <FormattedMessage id="status" />, type: 'text', value: parseStateIdToString(selectedTaskInfo.stateId), disabled: true },
            ]}
          />
        )}
    </IntlProvider> 
    </main>
  );
}

export default ScrumBoard;