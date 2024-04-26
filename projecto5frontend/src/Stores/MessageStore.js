import { create } from "zustand";

export const useMessageStore = create((set) => ({
    messages: [],
    updateMessages: (messages) => set({messages}),

    addMessage: (newMessage) =>
        set((state) => ({ messages: [...state.messages, newMessage] })),

    markMessageAsRead: (messageId) => {
        set((state) => ({
            messages: state.messages.map((message) => {
                if (message.id === messageId) {
                    return { ...message, status: "read" };
                }
                return message;
            }),
        }));
    },
        
    resetUseCategoryStore: () => set({ messages: [] }), 

}));