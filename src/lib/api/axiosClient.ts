
import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const axiosClient = axios.create({
  baseURL: configuredBaseUrl || "/api",
  headers: {
    Accept: "application/json",
  },
  timeout: 15_000,
});
