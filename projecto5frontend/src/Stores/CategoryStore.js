import { create } from "zustand";

export const useCategoryStore = create((set) => ({
    categories: [],
    updateCategories: (categories) => set({categories}),

    resetUseCategoryStore: () => set({ categories: [] }), 


}));