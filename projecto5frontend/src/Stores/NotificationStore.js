import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      updateNotifications: (notifications) => set({ notifications }),
      addNotification: (newNotification) =>
        set((state) => ({ notifications: [...state.notifications, newNotification] })),
      replaceOrAddNotification: (newNotification) =>
        set((state) => {
          const doesUserExist = state.notifications.some(notification => notification.sender.username === newNotification.sender.username);
      
          if (doesUserExist) {
            return {
              notifications: state.notifications.map(notification =>
                notification.sender.username === newNotification.sender.username ? newNotification : notification
              )
            };
          } else {
            return {
              notifications: [...state.notifications, newNotification]
            };
        }
      }),
      resetUseNotificationStore: () => set({ notifications: [] }),
    }),
    {
      name: "notification_storage", // unique name
    }
  )
);