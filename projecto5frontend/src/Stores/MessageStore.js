import { create } from "zustand";

export const useMessageStore = create((set) => ({
    messages: [],
    updateMessages: (messages) => set({messages}),
    addMessage: (newMessage) =>
        set((state) => ({ messages: [...state.messages, newMessage] })),

    resetUseCategoryStore: () => set({ messages: [] }), 

}));