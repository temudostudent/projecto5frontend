import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const userStore = create (
    persist (
        (set) => ({
            token:'', //state variable
            updateToken : (token) => set({token}),
            resetUserStore: () => set({ token: '', userData: [], receiverData: [], locale: 'en'}),    

            userData:[],
            updateUserData: (newUserData) => set({ userData: newUserData }),

            receiverData:[],
            updateReceiverData: (newReceiverData) => set({ receiverData: newReceiverData }),

            locale:"en",
            updateLocale : (locale) => set({ locale })
        }),
        {
            name: 'userStore',
            storage: createJSONStorage(() => sessionStorage)
        }

    )
);

