import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      updateNotifications: (notifications) => set({ notifications }),
      addNotification: (newNotification) =>
        set((state) => ({ notifications: [...state.notifications, newNotification] })),
      resetUseNotificationStore: () => set({ notifications: [] }),
    }),
    {
      name: "notification_storage", // unique name
    }
  )
);