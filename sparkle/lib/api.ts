import useSWR, { mutate } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

export type APIResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
};

type Options<B = unknown> = Omit<RequestInit, 'body'> & {
  body?: B;
};

/**
 * Helper to get auth headers if token exists.
 */
function getAuthHeaders() {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('access_token');
    if (token) {
      return { Authorization: `Bearer ${JSON.parse(token)}` }; // because you stored with JSON.stringify
    }
  }
  return {};
}

/**
 * Core fetcher used by SWR (for GET requests).
 */
export async function fetcher<T>(endpoint: string): Promise<APIResponse<T>> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

/**
 * Hook wrapper for SWR.
 */
export function useApiGet<T>(endpoint: string) {
  return useSWR<APIResponse<T>>(endpoint, fetcher);
}

/**
 * POST request (mutations).
 */
export async function apiPost<T, B = unknown>(
  endpoint: string,
  body: B,
  options?: Options
): Promise<APIResponse<T>> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

/**
 * PUT request (mutations).
 */
export async function apiPut<T, B = unknown>(
  endpoint: string,
  body: B,
  options?: Options
): Promise<APIResponse<T>> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    method: 'PUT',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

/**
 * DELETE request (mutations).
 */
export async function apiDelete<T>(endpoint: string, options?: Options): Promise<APIResponse<T>> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    method: 'DELETE',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

export function revalidate(endpoint: string) {
  mutate(endpoint);
}
