import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        return apiRequest(queryKey[0] as string);
      },
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
