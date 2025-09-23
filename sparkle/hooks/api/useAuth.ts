import { apiGet, apiPost, APIResponse } from '@/lib/api';
import { useState } from 'react';

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

type LoginData = {
  access_token: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<APIResponse<LoginData>> => {
    return await apiPost<LoginData>('api/auth/login', {
      email,
      password,
    });
  };

  const refreshUser = async () => {
    const response = await apiGet<User>('api/auth/refresh');
    console.log(response);
  };

  return {
    login,
    refreshUser,
  };
}
