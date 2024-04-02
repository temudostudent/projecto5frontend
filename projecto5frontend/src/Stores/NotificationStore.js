import { create } from "zustand";

export const useNotificationStore = create((set) => ({
    notifications: [], // state variable to keep all notifications 
    updateNotifications: (notifications) => set=({notifications}), // a function to update the list of notifications 
    addNotification: (newNotification) => set((state) => ({notifications: [...state.notifications, newNotification]})) // a function to add a new notification to the list of notifications 

}));