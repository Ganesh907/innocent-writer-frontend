
import axios from "axios";

import type {
  ApiErrorResponse,
} from "@/contracts/api";

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

  constructor(
    message: string,
    options: ApiErrorOptions = {},
  ) {
    super(message);

    this.name = "ApiError";
    this.status = options.status;
    this.validationErrors = options.validationErrors;
    this.code = options.code;
    this.requestId = options.requestId;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const isApiErrorResponse = (
  value: unknown,
): value is ApiErrorResponse => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<ApiErrorResponse>;
  const nestedError = candidate.error;

  const hasNestedError =
    typeof nestedError === "object" &&
    nestedError !== null &&
    typeof nestedError.detail === "string";

  const hasLegacyError =
    typeof candidate.message === "string";

  return (
    candidate.success === false &&
    (hasNestedError || hasLegacyError)
  );
};

/** Converts an unknown failure into the shared ApiError type. */
export const normalizeApiError = (
  error: unknown,
): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError<unknown>(error)) {
    const body = error.response?.data;

    const apiError = isApiErrorResponse(body)
      ? body
      : undefined;

    const problem = apiError?.error;

    let message =
      problem?.detail ?? apiError?.message;

    if (!message && error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    } else if (!message && !error.response) {
      message =
        "Unable to reach the server. Check your connection and try again.";
    } else if (!message) {
      message =
        error.message || "The request failed. Please try again.";
    }

    return new ApiError(message, {
      status: problem?.status ?? error.response?.status,
      validationErrors:
        problem?.errors ?? apiError?.errors,
      code: problem?.type ?? error.code,
      requestId: problem?.requestId,
    });
  }

  return new ApiError(
    error instanceof Error
      ? error.message
      : "An unexpected error occurred.",
  );
};

/** Returns a message suitable for displaying in the UI. */
export const getApiErrorMessage = (
  error: unknown,
): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

/** Returns backend field validation errors, when available. */
export const getApiValidationErrors = (
  error: unknown,
): Record<string, string> | undefined => {
  return error instanceof ApiError
    ? error.validationErrors
    : undefined;
};