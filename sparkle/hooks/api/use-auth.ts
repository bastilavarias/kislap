import { useApi } from '@/lib/api';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: 'default' | 'admin' | string; // tighten if you know all roles
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AuthLoginData = {
  access_token: string;
  user: AuthUser;
};

export function useAuth() {
  const { apiPost } = useApi();
  const [storageAuthUser, _] = useLocalStorage<AuthUser | null>('auth_user', null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    return await apiPost<AuthLoginData>('api/auth/login', {
      email,
      password,
    });
  };
  const syncAuthUser = () => {
    if (storageAuthUser) {
      setAuthUser(storageAuthUser);
    }
  };

  return {
    login,
    authUser,
    setAuthUser,
    syncAuthUser,
  };
}
