import { useLocalStorage } from '@/hooks/use-local-storage';

export interface APIResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export function useApi() {
  const GATEWAY_TIMEOUT_MS = 1200000;

  async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    let response: Response | null = null;
    let payload: APIResponse<T> | null = null;
    let message = '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
    };

    try {
      response = await fetch(`${API_BASE_URL}/${endpoint}`, requestOptions);

      clearTimeout(timeoutId);

      try {
        payload = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        payload = {
          success: false,
          status: response.status,
          message: 'Invalid JSON response from server',
          data: null,
        } as APIResponse<T>;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      message = err instanceof Error ? err.message : String(err);
      if (message.includes('AbortError')) {
        message = `Request timed out after ${GATEWAY_TIMEOUT_MS / 1000} seconds.`;
        return {
          success: false,
          status: 408,
          message,
          data: null,
        };
      }

      return {
        success: false,
        status: response?.status ?? 500,
        message,
        data: null,
      };
    }

    if (!response?.ok) {
      return {
        success: false,
        status: payload?.status ?? response.status ?? 500,
        message: payload?.message || message || 'API Request failed with status code.',
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      data: payload!.data as T,
      message: payload?.message || 'API request success.',
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
