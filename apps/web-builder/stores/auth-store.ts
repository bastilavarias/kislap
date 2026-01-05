import { create } from 'zustand';
import { AuthUser } from '@/hooks/api/use-auth';

type AuthStore = {
  authUser: AuthUser | null;
  setAuthUser: (u: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (u) => set({ authUser: u }),
}));
