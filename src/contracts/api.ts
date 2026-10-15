/** Standard success envelope returned by the backend. */
export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

/** Success envelope used by message-only endpoints. */
export interface ApiMessageResponse {
  success: true;
  message: string;
}

/** Structured global error payload. */
export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  requestId: string;
  path?: string;
  stack?: string;
  errors?: Record<string, string>;
}

/**
 * Supports the new nested error format and the previous
 * { success: false, message, errors? } format.
 */
export interface ApiErrorResponse {
  success: false;
  error?: ApiProblemDetails;
  message?: string;
  errors?: Record<string, string>;
}

/** Metadata returned by paginated APIs. */
export interface PaginationMeta {
  page: number;
  limit: number;
}
