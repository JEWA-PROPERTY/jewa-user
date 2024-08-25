// store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'user-storage',
});

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

export interface UserDetails {
  userid: number;
  fullname: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
  terminated_at: string | null;
  updated_at: string;
  sessiontoken: string;
  sessionstatus: string | null;
  usertype: string;
  usertype_id: string;
  house_id: number;
  housename: string;
  community_code: string;
}

interface UserState {
  user: UserDetails | null;
  setUser: (user: UserDetails) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserDetails) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);