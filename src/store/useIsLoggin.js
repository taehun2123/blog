import { create } from 'zustand';

const useIsLogginStore = create(set => ({
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

export const useLogin = () => useIsLogginStore((state) => state.isLoggedin);
export const useUserData = () => useIsLogginStore((state) => state.userData);
export const useUserImg = () => useIsLogginStore((state) => state.userImg);

export const useLoginActions = () => useIsLogginStore((state) => state.actions);