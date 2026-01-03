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
  image_url: string;
  newsletter: boolean;
  github: boolean;
  google: boolean;
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

  const [storageAuthUser, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);

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

  const googleLogin = (code: string) => {
    return apiPost('api/auth/google', { code });
  };

  const logout = async () => {
    setAuthUser(null);
    setStorageAuthUser(null);
    setAccessToken(null);

    try {
      await apiGet('api/auth/logout');
    } catch (error) {
      console.error('Logout API failed', error);
    }
  };

  return {
    login,
    authUser,
    setAuthUser,
    syncAuthUser,
    githubLogin,
    logout,
    googleLogin,
  };
}
