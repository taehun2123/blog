import { create } from 'zustand';

const useCommentStore = create(set => ({
  author: "",
  passwd: "",
  comment: "",
  actions: {
    setAuthor : (value) => 
      set(state => ({
        author: value
      })),
    setPasswd : (value) => 
      set(state => ({
        passwd: value
      })),
    setComment : (value) => 
      set(state => ({
        comment: value
      })),
    resetCommentInput : () =>
      set(state => ({
        comment: "",
        passwd: "",
        author: "",
      }))
  }
}))


export const useComment = () => {
  return useCommentStore(state => ({
    author: state.author,
    comment: state.comment,
    passwd: state.passwd
  }));
};

export const useCommentActions = () => useCommentStore((state) => state.actions);
