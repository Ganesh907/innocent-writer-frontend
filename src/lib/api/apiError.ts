import axios from "axios";

import type { ApiErrorResponse } from "@/contracts/api";

export interface ApiErrorOptions {
  status?: number;
  validationErrors?: Record<string, string>;
  code?: string;
  requestId?: string;
}

/** Normalized error for API requests and UI error states. */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly validationErrors: Record<string, string> | undefined;
  readonly code: string | undefined;
  readonly requestId: string | undefined;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.validationErrors = options.validationErrors;
    this.code = options.code;
    this.requestId = options.requestId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Partial<ApiErrorResponse>;
  const nestedError = candidate.error;

  const hasNestedError =
    typeof nestedError === "object" &&
    nestedError !== null &&
    typeof nestedError.detail === "string";

  return (
    candidate.success === false &&
    (hasNestedError || typeof candidate.message === "string")
  );
};

const GENERIC_ERROR = "Something went wrong. Please try again later.";

const safeClientMessage = (status: number, serverMessage?: string): string => {
  // Never expose server/internal errors for 5xx responses.
  if (status >= 500) return GENERIC_ERROR;

  // Only use server messages for client errors (4xx).
  if (serverMessage?.trim()) return serverMessage;

  switch (status) {
    case 400:
      return "Please check the information you entered and try again.";
    case 401:
      return "Your email or password is incorrect.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested item could not be found.";
    case 409:
      return "This request conflicts with existing information.";
    case 413:
      return "The submitted content is too large.";
    case 422:
      return "Please check the information you entered.";
    case 429:
      return "Too many attempts. Please wait and try again.";
    default:
      return "The request could not be completed. Please try again.";
  }
};

/** Converts an unknown failure into the shared ApiError type. */
export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<unknown>(error)) {
    const body = error.response?.data;
    const apiError = isApiErrorResponse(body) ? body : undefined;
    const problem = apiError?.error;
    const status = problem?.status ?? error.response?.status;

    let message: string;

    if (error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    } else if (!error.response) {
      message =
        "Unable to reach the server. Check your connection and try again.";
    } else if (status !== undefined) {
      message = safeClientMessage(status, problem?.detail ?? apiError?.message);
    } else {
      message = GENERIC_ERROR;
    }

    return new ApiError(message, {
      status,
      // Do not expose validation details from server errors.
      validationErrors:
        status !== undefined && status < 500
          ? (problem?.errors ?? apiError?.errors)
          : undefined,
      code: problem?.type ?? error.code,
      requestId: problem?.requestId,
    });
  }

  // Do not display arbitrary JavaScript error messages in the UI.
  return new ApiError(GENERIC_ERROR);
};

/** Returns a message suitable for displaying in the UI. */
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  return GENERIC_ERROR;
};

/** Returns backend field validation errors, when available. */
export const getApiValidationErrors = (
  error: unknown,
): Record<string, string> | undefined => {
  return error instanceof ApiError ? error.validationErrors : undefined;
};
