import { create } from 'zustand';

const useSidebarStore = create(set => ({
  isOpened: false,
  actions: {
    setIsOpened : () => 
      set(state => ({
        isOpened: !state.isOpened
      })),
    setClosed: () =>
      set(state => ({
        isOpened: false
      }))
  }
}))

export const useSidebar = () => useSidebarStore((state) => state.isOpened);
export const useSidebarActions = () => useSidebarStore((state) => state.actions);
