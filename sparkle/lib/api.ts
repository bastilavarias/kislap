import { useLocalStorage } from '@/hooks/use-local-storage';
import { AuthUser } from '@/hooks/api/use-auth';

export interface APIResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export function useApi() {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [_, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const GATEWAY_TIMEOUT_MS = 1200000;

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

    // --- TIMEOUT IMPLEMENTATION START ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);
    const isFormData = options.body instanceof FormData;

    const requestOptions: RequestInit = {
      ...options,
      headers: buildHeaders(accessToken || undefined, isFormData),
      credentials: 'include',
      signal: controller.signal, // Attach the AbortController's signal
    };
    // --- TIMEOUT IMPLEMENTATION END ---

    try {
      response = await fetch(`${API_BASE_URL}/${endpoint}`, requestOptions);

      clearTimeout(timeoutId); // Clear the timeout if the request finished in time

      if (response.status === 401) {
        // --- REFRESH LOGIC ---
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

          // --- RETRY LOGIC (Uses a new AbortController for a fresh timeout) ---
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), GATEWAY_TIMEOUT_MS);

          const retryIsFormData = options.body instanceof FormData;

          response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers: buildHeaders(newAccessToken, retryIsFormData),
            credentials: 'include',
            signal: retryController.signal, // Use the new signal
          });

          clearTimeout(retryTimeoutId); // Clear the retry timeout
          // --- END RETRY LOGIC ---
        }
      }

      // Attempt to parse JSON response
      try {
        payload = await response.json();
      } catch (parseError) {
        // Handle cases where the response is not valid JSON (e.g., 500 error page)
        console.error('Failed to parse JSON response:', parseError);
        // Create a generic payload to handle the failure block below
        payload = {
          success: false,
          status: response.status,
          message: 'Invalid JSON response from server',
          data: null,
        } as APIResponse<T>;
      }
    } catch (err) {
      clearTimeout(timeoutId); // Ensure timeout is cleared on any initial error
      message = err instanceof Error ? err.message : String(err);

      if (message.includes('AbortError')) {
        // Specific error handling for the timeout
        message = `Request timed out after ${GATEWAY_TIMEOUT_MS / 1000} seconds.`;
        return {
          success: false,
          status: 408, // 408 Request Timeout is an appropriate status
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

    // --- Consolidated Error Handling ---
    if (!response?.ok) {
      // This handles non-2xx HTTP codes and cases where JSON parsing failed (handled in try/catch)
      return {
        success: false,
        status: payload?.status ?? response.status ?? 500,
        message: payload?.message || message || 'API Request failed with status code.',
        data: null,
      };
    }

    // Handle successful 2xx response
    return {
      success: true,
      status: response.status,
      data: payload!.data as T, // We are confident payload exists and is successful here
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
