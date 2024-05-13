import { create } from 'zustand';

const useAdminStore = create(set => ({
  isAdmin: false,
  actions: {
    setIsAdmin : (value) => 
      set(state => ({
        isAdmin: value
      })),
}
}))

export const useAdmin = () => useAdminStore((state) => state.isAdmin);
export const useAdminActions = () => useAdminStore((state) => state.actions);