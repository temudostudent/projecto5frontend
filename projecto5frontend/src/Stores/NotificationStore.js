import { notification } from "antd";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],

      updateNotifications: (notifications) => set({ notifications }),

      addNotification: (newNotification) =>
        set((state) => ({ notifications: [...state.notifications, newNotification] })),

        replaceOrAddMessageNotification: (newNotification) =>
        set((state) => {
          let updatedNotifications;
      
          if (newNotification.type === 10) {
            updatedNotifications = state.notifications.map((notification) =>
              notification.sender.username === newNotification.sender.username ? newNotification : notification
            );
          } else if (newNotification.type === 20) {
            updatedNotifications = state.notifications.slice();
            updatedNotifications.unshift(newNotification);
          } else {
            updatedNotifications = state.notifications.map((notification) =>
              notification.task.id === newNotification.task.id ? newNotification : notification
            );
          }
      
          const index = updatedNotifications.findIndex((notification) =>
            newNotification.type === 10 ? notification.sender.username === newNotification.sender.username : notification.task.id === newNotification.task.id
          );
      
          if (index !== -1) {
            // Se a notificação existe, move-a para o início do array
            updatedNotifications.splice(index, 1);
            updatedNotifications.unshift(newNotification);
          } else {
            // Se a notificação não existe, adiciona-a no início do array
            updatedNotifications.unshift(newNotification);
          }
      
          return {
            notifications: updatedNotifications,
          };
        }),

      resetUseNotificationStore: () => set({ notifications: [] }),
    }),
    {
      name: "notification_storage", // unique name
    }
  )
);