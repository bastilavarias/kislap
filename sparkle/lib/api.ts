import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthLoginData, AuthUser, useAuth } from '@/hooks/api/useAuth';

export type APIResponse<T> = { success: boolean; status: number; message: string; data: T | null };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export function useApi() {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [_, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const buildHeaders = (token?: string) => ({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    });

    let response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: buildHeaders(accessToken || undefined),
      credentials: 'include',
    });

    if (response.status === 401) {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'GET',
        headers: buildHeaders(),
      });

      const result = await refreshResponse.json();

      if (!result?.success) {
        window.location.href = '/login';
        throw new Error('Unauthorized'); // stop execution
      }

      const newAccessToken = result?.data?.access_token;
      if (result?.success && newAccessToken) {
        setAccessToken(newAccessToken);
        setStorageAuthUser(result.data.user);

        // retry the original request with the new token
        response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          ...options,
          headers: buildHeaders(newAccessToken),
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  return {
    apiGet: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    apiPost: <T, B = unknown>(endpoint: string, body: B, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    apiPut: <T, B = unknown>(endpoint: string, body: B, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    apiDelete: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}
