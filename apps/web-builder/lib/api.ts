import { useLocalStorage } from '@/hooks/use-local-storage';
import { AuthUser } from '@/hooks/api/use-auth';

export interface APIResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.app/api';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export function useApi() {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [_, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const GATEWAY_TIMEOUT_MS = 120000; // 2 minutes

  async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const buildHeaders = (token?: string, isFormData = false) => {
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
      };

      if (token) headers.Authorization = `Bearer ${token}`;
      if (!isFormData) headers['Content-Type'] = 'application/json';

      return headers;
    };

    let response: Response | null = null;
    let payload: APIResponse<T> | null = null;
    let message = '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);
    const isFormData = options.body instanceof FormData;

    let currentToken = accessToken;
    const performFetch = async (token?: string) => {
      return fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: buildHeaders(token || undefined, isFormData),
        credentials: 'include',
        signal: controller.signal,
      });
    };

    try {
      response = await performFetch(currentToken || undefined);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
              });

              if (!refreshRes.ok) throw new Error('Refresh failed');

              const json = await refreshRes.json();
              const newData = json.data;

              setAccessToken(newData.access_token);
              setStorageAuthUser(newData.user);

              return newData.access_token as string;
            } catch (error) {
              window.localStorage.setItem('error', JSON.stringify(error));
              console.error('Token refresh error:', error);
              setAccessToken(null);
              setStorageAuthUser(null);
              window.location.href = '/';
              return null;
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          })();
        }

        const newAccessToken = await refreshPromise;

        if (newAccessToken) {
          const retryController = new AbortController();
          const retryTimeout = setTimeout(() => retryController.abort(), GATEWAY_TIMEOUT_MS);

          response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers: buildHeaders(newAccessToken, isFormData),
            credentials: 'include',
            signal: retryController.signal,
          });

          clearTimeout(retryTimeout);
        }
      }

      try {
        payload = await response.json();
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        payload = {
          success: false,
          status: response.status,
          message: 'Invalid server response',
          data: null,
        };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      message = err instanceof Error ? err.message : String(err);

      if (message.includes('AbortError')) {
        return { success: false, status: 408, message: 'Request timeout', data: null };
      }

      return { success: false, status: 500, message, data: null };
    }

    if (!response?.ok) {
      return {
        success: false,
        status: payload?.status ?? response.status,
        message: payload?.message || message || 'Request failed',
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      data: payload!.data as T,
      message: payload?.message || 'Success',
    };
  }

  return {
    apiGet: <T>(url: string, opts?: RequestInit) => apiRequest<T>(url, { ...opts, method: 'GET' }),
    apiPost: <T, B = unknown>(url: string, body: B, opts?: RequestInit) =>
      apiRequest<T>(url, {
        ...opts,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    apiPut: <T, B = unknown>(url: string, body: B, opts?: RequestInit) =>
      apiRequest<T>(url, {
        ...opts,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    apiDelete: <T>(url: string, opts?: RequestInit) =>
      apiRequest<T>(url, { ...opts, method: 'DELETE' }),
  };
}
