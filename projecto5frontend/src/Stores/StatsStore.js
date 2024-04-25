import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStatsStore = create(
    persist(
        (set) => ({
          usersStats: [],
          updateUserStats: (userStats) => set({ userStats }),
    
          tasksStats: [],
          updateTasksStats: (tasksStats) => set({ tasksStats }),
          
          resetUseStatsStore: () => set({ usersStats: [],btasksStats: [] }),
    
        }),
        {
          name: "stats_storage",
        }
      )
    );