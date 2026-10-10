
import axios from "axios";

import { normalizeApiError } from "./apiError";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

/** Shared HTTP client used by all feature API modules. */
export const axiosClient = axios.create({
  baseURL: configuredBaseUrl || "/api",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Preserve cancellation semantics for requests using AbortSignal.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    return Promise.reject(normalizeApiError(error));
  },
);
