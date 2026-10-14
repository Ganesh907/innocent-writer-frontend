import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./apiError";

const shouldRetryQuery = (
  failureCount: number,
  error: Error,
): boolean => {
  // Retrying a client-side 4xx request will not fix the problem.
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
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});