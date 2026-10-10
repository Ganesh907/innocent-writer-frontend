
import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./apiError";

const shouldRetryQuery = (
  failureCount: number,
  error: Error,
): boolean => {
  // Retrying the same client-side request will not fix a 4xx response.
  if (
    error instanceof ApiError &&
    error.status !== undefined &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return false;
  }

  // Retry network errors and server failures once.
  return failureCount < 1;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
