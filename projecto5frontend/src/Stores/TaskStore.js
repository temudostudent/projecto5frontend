import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [], // Initialize tasks as an empty array
      selectedTask: null,

      updateTasks: (tasks) => set({ tasks }),

      setSelectedTask: (task) => set({ selectedTask: task }),

      addTask: (newTask) => 
        set((state) => {
          // Find the index where the new task should be inserted
          const index = state.tasks.findIndex(task => task.priority > newTask.priority);
          // If no task has higher priority, insert at the end
          const insertIndex = index === -1 ? state.tasks.length : index;
          // Insert the new task at the correct position
          const updatedTasks = [
            ...state.tasks.slice(0, insertIndex),
            newTask,
            ...state.tasks.slice(insertIndex)
          ];
          return { tasks: updatedTasks };
        }),
      

      replaceTaskById: (newTask) =>
        set((state) => {
          if (!Array.isArray(state.tasks)) {
            state.tasks = [];
          }
          
          const doesTaskExist = state.tasks.some(task => task.id === newTask.id);

          if (doesTaskExist) {
            return {
              tasks: state.tasks.map(task =>
                task.id === newTask.id ? newTask : task
              )
            };
          } 
          return state;
        }),

      deleteTaskById: (taskId) =>
        set((state) => {
          return {
            tasks: state.tasks.filter(task => task.id !== taskId)
          };
        }),
      resetUseTaskStore: () => set({ tasks: [], selectedTask: null }),

    }),
    {
      name: "task_storage",
    }
  )
);