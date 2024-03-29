import { create } from "zustand";

export const useTaskStore = create((set) => ({
    tasks: [],
    selectedTask: null,
    updateTasks: (tasks) => set({ tasks }),
    setSelectedTask: (task) => set({ selectedTask: task }),

    resetUseTaskStore: () => set({ tasks: [], selectedTask: null }), 

}));