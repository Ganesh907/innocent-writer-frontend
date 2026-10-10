
import type {
  ApiSuccessResponse,
  PaginationMeta,
} from "./api";

/**
 * Public poem representation returned by poemService.toPublicPoem().
 * Nullable fields support legacy records without images or an Instagram URL.
 * Internal Cloudinary IDs and the author relation are not exposed.
 */
export interface Poem {
  id: string;
  title: string;
  content: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;

  coverImageUrl: string | null;
  poemImageUrl: string | null;
  instagramPostUrl: string | null;
  authorName: string | null;
}

/** Request body for POST /api/poems. */
export interface CreatePoemRequest {
  title: string;
  content: string;
  coverImage: string;
  poemImage: string;
  instagramPostUrl?: string | null;
}

/**
 * Request body for PUT /api/poems/:id.
 * Omit image fields to retain existing images.
 * Supply a data URI to replace an image.
 */
export interface UpdatePoemRequest {
  title?: string;
  content?: string;
  published?: boolean;
  coverImage?: string;
  poemImage?: string;
  instagramPostUrl?: string | null;
}

/** Supported query parameters for GET /api/poems. */
export interface GetPoemsParams {
  page?: number;
  limit?: number;
  title?: string;
  authorId?: string;
}

/** The backend returns pagination beside data, not inside data. */
export interface PoemListResponse
  extends ApiSuccessResponse<Poem[]> {
  pagination: PaginationMeta;
}

// import type {
//   ApiSuccessResponse,
//   PaginationMeta,
// } from "./api";

// /**
//  * Public poem response returned by the backend.
//  * Image and Instagram URL fields are nullable for legacy records.
//  * Internal Cloudinary IDs and the author relation are not exposed.
//  */
// export interface Poem {
//   id: string;
//   title: string;
//   content: string;
//   published: boolean;
//   viewCount: number;
//   createdAt: string;
//   updatedAt: string;
//   authorId: string;

//   coverImageUrl: string | null;
//   poemImageUrl: string | null;
//   instagramPostUrl: string | null;
//   authorName: string | null;
// }

// /** Request body for POST /api/poems. */
// export interface CreatePoemRequest {
//   title: string;
//   content: string;
//   coverImage: string;
//   poemImage: string;
//   instagramPostUrl?: string | null;
// }

// /**
//  * Request body for PUT /api/poems/:id.
//  * Omit image fields to retain existing images.
//  * Supply a data URI to replace an image.
//  */
// export interface UpdatePoemRequest {
//   title?: string;
//   content?: string;
//   published?: boolean;
//   coverImage?: string;
//   poemImage?: string;
//   instagramPostUrl?: string | null;
// }

// /** Supported query parameters for GET /api/poems. */
// export interface GetPoemsParams {
//   page?: number;
//   limit?: number;
//   title?: string;
//   authorId?: string;
// }

// /** The backend places pagination beside data, not inside data. */
// export interface PoemListResponse
//   extends ApiSuccessResponse<Poem[]> {
//   pagination: PaginationMeta;
// }
