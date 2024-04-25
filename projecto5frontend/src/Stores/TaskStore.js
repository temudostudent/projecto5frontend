import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      selectedTask: null,
      updateTasks: (tasks) => set({ tasks }),
      setSelectedTask: (task) => set({ selectedTask: task }),
      addTask: (newTask) =>
        set((state) => ({ tasks: [...state.tasks, newTask] })),
      replaceTaskById: (newTask) =>
        set((state) => {
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