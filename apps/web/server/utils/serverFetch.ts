import type { H3Event } from "h3";

type ServerFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>;
};

export async function protectedServerFetch<T = unknown>(
  event: H3Event,
  url: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const session = await requireUserSession(event);
  const originalHeaders = options.headers;
  const headers: Record<string, string> = { ...(originalHeaders || {}) };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const baseURL = useRuntimeConfig().public.apiUrl as string;

  try {
    return (await $fetch<T>(url, {
      baseURL,
      ...options,
      headers,
    })) as T;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.statusCode === 401) {
      await clearUserSession(event);
    }
    throw error;
  }
}

export async function publicServerFetch<T = unknown>(
  event: H3Event,
  url: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const originalHeaders = options.headers;
  const headers: Record<string, string> = { ...(originalHeaders || {}) };

  const baseURL = useRuntimeConfig().public.apiUrl as string;

  return (await $fetch<T>(url, {
    baseURL,
    ...options,
    headers,
  })) as T;
}
