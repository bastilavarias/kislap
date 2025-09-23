import { apiPost, APIResponse } from '@/lib/api';

type LoginData = {
  access_token: string;
};

export function useAuth() {
  const login = async (email: string, password: string): Promise<APIResponse<LoginData>> => {
    return await apiPost<LoginData>('api/auth/login', {
      email,
      password,
    });
  };

  return {
    login,
  };
}
