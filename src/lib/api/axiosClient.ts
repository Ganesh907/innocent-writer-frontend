import axios from "axios";

import { normalizeApiError } from "./apiError";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthToken,
  getAuthToken,
} from "@/features/auth/tokenStorage";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

/** Shared HTTP client used by all feature API modules. */
export const axiosClient = axios.create({
  baseURL: configuredBaseUrl || "/api",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.delete("Authorization");
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      getAuthToken()
    ) {
      clearAuthToken();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
