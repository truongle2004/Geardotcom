import type { UserInfo } from '@/types';
import { create } from 'zustand';

interface UserStore {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const useUserStore = create<UserStore>((set) => ({
  userInfo: {
    sub: '',
    email: '',
    name: '',
    given_name: '',
    family_name: '',
    preferred_username: '',
    email_verified: false
  },
  setUserInfo: (userInfo: UserInfo) => set({ userInfo })
}));

export default useUserStore;
