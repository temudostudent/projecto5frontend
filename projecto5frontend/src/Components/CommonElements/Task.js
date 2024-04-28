import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { MdEdit, MdDelete, MdOutlineRestore } from "react-icons/md";
import { userStore } from '../../Stores/UserStore'
import { useTaskStore } from '../../Stores/TaskStore'
import { useActionsStore } from '../../Stores/ActionStore'
import { useLocation } from 'react-router-dom';
import { TbArrowMoveDown } from "react-icons/tb";
import { TbArrowMoveUp } from "react-icons/tb";


const Task = ({ task , index , onEraseStatusChange, onTaskDoubleClick, onDeleteChange, onChangeTaskStatus }) => {

  // Accessing necessary state and functions from stores and hooks
  const { setSelectedTask } = useTaskStore();
  const { updateShowSidebar, updateIsEditing } = useActionsStore();
  const userData = userStore((state) => state.userData);
  const location = useLocation()

  // Function to handle rendering task priority based on priority level
  const handleTaskPriority = (priority) => {
    let priorityClass = 'priority-color ';
    if (priority === 100) {
      priorityClass += 'low';
    } else if (priority === 200) {
      priorityClass += 'medium';
    } else {
      priorityClass += 'high';
    }
    return <span className={priorityClass}></span>;
  }

  // Event handler for clicking the erase button
  const handleEraseClick = async () => {
    console.log('erase');
    onEraseStatusChange(task.id);
  }

  // Event handler for clicking the restore button
  const handleRestoreClick = async () => {
    onEraseStatusChange(task.id);
  }

  // Event handler for clicking the permanent delete button
  const handlePermDeleteClick = async () => {
    onDeleteChange(task.id);
  }

  // Event handler for clicking the edit button
  const handleEditClick = () => {
    setSelectedTask(task);
    updateIsEditing(true);
    updateShowSidebar(false);
    console.log(task);
  };

  // Event handler for double clicking a task
  const handleDoubleClick = () => {
    onTaskDoubleClick(task);
    console.log(task);
  };

  const handleChangeTaskStatusUp = () => {
    
    if (task.stateId === 300 || task.stateId === 200){
      onChangeTaskStatus(task.id, task.stateId - 100);
    }
    
  }

  const handleChangeTaskStatusDown = () => {
    
    if (task.stateId === 100 || task.stateId === 200){
      onChangeTaskStatus(task.id, task.stateId + 100);
    }
  }


  return (
    
    <Draggable draggableId={task.id} index={index}>

      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task ${snapshot.isDragging ? 'dragging' : ''} ${task.erased ? 'erased' : ''}`}
          onDoubleClick={handleDoubleClick}
        >
          <div className='top-container'>
            <span>{task.owner.username}</span>
            {handleTaskPriority(task.priority)}
          </div>
          <div className='container-task'>
            <div className='text-container'>
              <p>{task.title}</p>
              <p style={{ fontSize: '8px' }}>{task.category.name}</p>
            </div>

            {(location.pathname === '/home' || (location.pathname === '/alltasks' && userData.typeOfUser !== 100)) && (
                    <div className='buttons-container'>
                      {window.innerWidth < 820 && task.stateId !== 100 && (
                        <span title='Transfer Task to column above' onClick={handleChangeTaskStatusUp}><TbArrowMoveUp /></span>
                      )}
                      {window.innerWidth < 820 && task.stateId !== 300 && (
                        <span title='Transfer Task to column below' onClick={handleChangeTaskStatusDown}><TbArrowMoveDown /></span>
                      )}
                    
                    <span title="Edit" onClick={handleEditClick}><MdEdit /></span>
      
                    {task.erased && (
                      <>
                          <span title="Restore" onClick={handleRestoreClick}><MdOutlineRestore /></span>
                          <span title="Delete" onClick={handlePermDeleteClick}><MdDelete /></span>
                      </>
                    )}
      
                    {!task.erased && (
                      <span title="Erase" onClick={handleEraseClick}><MdDelete /></span>
                    )}
                  </div>
            )}

            


          </div>
        </div>
      )}
    </Draggable>
  
  );
}

Task.propTypes = {
task: PropTypes.object.isRequired,
};

export default Task;