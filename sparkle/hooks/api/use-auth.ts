import { useApi } from '@/lib/api';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuthStore } from '@/stores/auth-store';

export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AuthLoginData = {
  access_token: string;
  user: AuthUser;
};

export function useAuth() {
  const { apiPost, apiGet } = useApi();
  const [storageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const login = async (email: string, password: string) => {
    return await apiPost('api/auth/login', { email, password });
  };

  const syncAuthUser = () => {
    if (storageAuthUser) {
      setAuthUser(storageAuthUser);
    }
  };

  const githubLogin = (code: string) => {
    return apiPost('api/auth/github', { code });
  };

  const logout = () => apiGet('api/auth/logout');

  return {
    login,
    authUser,
    setAuthUser,
    syncAuthUser,
    githubLogin,
    logout,
  };
}
