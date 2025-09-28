import { useLocalStorage } from '@/hooks/use-local-storage';
import { AuthUser } from '@/hooks/api/use-auth';

export type APIResponse<T> = { success: boolean; status: number; message: string; data: T | null };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export function useApi() {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [_, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const buildHeaders = (token?: string, isFormData = false) => {
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
      };

      if (token) headers.Authorization = `Bearer ${token}`;
      // Only set JSON content-type if not uploading FormData
      if (!isFormData) headers['Content-Type'] = 'application/json';

      return headers;
    };

    let response: Response | null = null;
    let payload: APIResponse<T> | null = null;
    let message = '';

    try {
      const isFormData = options.body instanceof FormData;

      response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: buildHeaders(accessToken || undefined, isFormData),
        credentials: 'include',
      });

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

          const retryIsFormData = options.body instanceof FormData;
          response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers: buildHeaders(newAccessToken, retryIsFormData),
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

    if (!payload || !response?.ok) {
      return {
        success: false,
        status: payload?.status ?? response?.status ?? 500,
        message: payload?.message || message || 'Request failed',
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      message: 'API request success.',
      data: payload as T,
    };
  }

  return {
    apiGet: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    apiPost: <T, B = unknown>(endpoint: string, body: B, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
        signal: AbortSignal.timeout(120000),
      }),
    apiPut: <T, B = unknown>(endpoint: string, body: B, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    apiDelete: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}
