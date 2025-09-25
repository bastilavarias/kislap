import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthUser } from '@/hooks/api/useAuth';

export type APIResponse<T> = { success: boolean; status: number; message: string; data: T | null };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export function useApi() {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [_, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const buildHeaders = (token?: string) => ({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    });

    let response: Response | null = null;
    let payload: APIResponse<T> | null = null;
    let message = '';

    try {
      response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: buildHeaders(accessToken || undefined),
        credentials: 'include',
      });

      // Handle expired token → refresh
      if (response.status === 401) {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'GET',
          headers: buildHeaders(),
          credentials: 'include',
        });

        if (!refreshRes.ok) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }

        const refreshedUserData = await refreshRes.json();
        const newAccessToken = refreshedUserData?.access_token;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          setStorageAuthUser(refreshedUserData?.user);

          // retry original request with new token
          response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers: buildHeaders(newAccessToken),
            credentials: 'include',
          });
        }
      }

      payload = await response.json();
    } catch (err) {
      message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        status: response?.status ?? 500,
        message,
        data: null,
      };
    }

    // Unified return block
    if (!response?.ok || !payload?.success) {
      return {
        success: false,
        status: payload?.status ?? response?.status ?? 500,
        message: payload?.message || message || 'Request failed',
        data: null,
      };
    }

    return {
      success: true,
      status: payload.status,
      message: payload.message,
      data: payload.data as T,
    };
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
