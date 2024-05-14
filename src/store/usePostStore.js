import { create } from 'zustand';

const usePostStore = create(set => ({
  title: "",
  contents: "",
  category: {
    prev: "FrontEnd",
    current: ""
  },
  actions: {
    setTitle : (value) => 
      set(state => ({
        title: value
      })),
    setContents : (value) => 
      set(state => ({
        contents: value
      })),
    setCategoryPrev : (prev) => 
      set(state => ({
        ...state,
        category: {
          ...state.category,
          prev: prev
        }
      })),
    setCategoryCurrent : (current) => 
      set(state => ({
        ...state,
        category: {
          ...state.category,
          current: current
        }
      })),
    resetPost : () =>
      set(state => ({
        title: "",
        contents: "",
        category: {
          prev: "",
          current: ""
        },
      }))
  }
}))


export const usePost = () => {
  return usePostStore(state => ({
    title: state.title,
    contents: state.contents,
    category: state.category  
  }));
};

export const usePostActions = () => usePostStore((state) => state.actions);