import { create } from 'zustand';

const useIsLoginStore = create(set => ({
  isLoggedin: false,
  userData: "",
  userImg: "",
  actions: {
    setIsLoggedIn : (value) => 
      set(state => ({
        isLoggedin: value
      })),
    setUserData : (value) => 
      set(state => ({
        userData: value
      })),
    setUserImg : (value) => 
      set(state => ({
        userImg: value
      })),  
}
}))

export const useLogin = () => useIsLoginStore((state) => state.isLoggedin);
export const useUserData = () => useIsLoginStore((state) => state.userData);
export const useUserImg = () => useIsLoginStore((state) => state.userImg);

export const useLoginActions = () => useIsLoginStore((state) => state.actions);