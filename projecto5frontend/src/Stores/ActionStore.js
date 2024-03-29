import { create } from "zustand";

export const useActionsStore = create((set) => ({
    showModal : false,
    updateShowModal : (showModal) => set({showModal}),    
    
    showSidebar : true,
    updateShowSidebar : (showSidebar) => set({showSidebar}),

    isEditing : false,
    updateIsEditing : (isEditing) => set({isEditing}),

    isAllTasksPage : false,
    updateIsAllTasksPage : (isAllTasksPage) => set({isAllTasksPage}),

    resetUseActionsStore: () => set({ showModal : false, showSidebar : true, isEditing : false, isAllTasksPage : false,}),  

}));