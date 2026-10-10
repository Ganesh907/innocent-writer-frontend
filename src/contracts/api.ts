
/** Standard success envelope returned by the backend. */
export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

/** Success envelope used by message-only endpoints, such as poem deletion. */
export interface ApiMessageResponse {
  success: true;
  message: string;
}

/** Standard error envelope returned by the backend error middleware. */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

/** Metadata returned by GET /api/poems. */
export interface PaginationMeta {
  page: number;
  limit: number;
}
