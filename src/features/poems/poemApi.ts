import type { ApiMessageResponse, ApiSuccessResponse } from "@/contracts/api";
import type {
  CreatePoemRequest,
  GetPoemsParams,
  Poem,
  PoemListResponse,
  PoemImageAsset,
  UpdatePoemRequest,
} from "@/contracts/poem";
import { axiosClient } from "@/lib/api/axiosClient";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface PoemImageUploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  allowedFormats: string;
  signature: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
}

/** Uploads an image directly to Cloudinary using a short-lived backend signature. */
export const uploadPoemImage = async (file: File): Promise<PoemImageAsset> => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {    throw new Error("Choose a JPEG, PNG, or WebP image.");
  }

  if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      "Each image must be larger than 0 bytes and no larger than 5 MB.",
    );
  }

  const signatureResponse = await axiosClient.post<
    ApiSuccessResponse<PoemImageUploadSignature>
  >("/poems/upload-signature");
  const signature = signatureResponse.data.data;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signature.apiKey);
  body.append("timestamp", String(signature.timestamp));
  body.append("folder", signature.folder);
  body.append("allowed_formats", signature.allowedFormats);
  body.append("signature", signature.signature);

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
      { method: "POST", body },
    );
  } catch {
    throw new Error("Image upload failed. Check your connection and try again.");
  }

  const result = (await response.json().catch(() => ({}))) as CloudinaryUploadResponse;
  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(
      result.error?.message || "Cloudinary could not upload this image.",
    );
  }

  return { secureUrl: result.secure_url, publicId: result.public_id };
};

/** GET /api/poems?page=&limit=&title=&authorId= */
export const getPoems = async (
  params: GetPoemsParams = {},
  signal?: AbortSignal,
): Promise<PoemListResponse> => {
  const response = await axiosClient.get<PoemListResponse>("/poems", {
    params,
    signal,
  });

  return response.data;
};

/** GET /api/poems/:id — public endpoint. */
export const getPoemById = async (id: string): Promise<Poem> => {
  const response = await axiosClient.get<ApiSuccessResponse<Poem>>(
    `/poems/${encodeURIComponent(id)}`,
  );

  return response.data.data;
};

export interface RecordPoemViewResult {
  counted: boolean;
  viewCount: number;
}

/**
 * POST /api/poems/:id/view
 *
 * The backend permanently deduplicates views by visitor and poem.
 */
export const recordPoemView = async (
  id: string,
): Promise<RecordPoemViewResult> => {
  const response = await axiosClient.post<
    ApiSuccessResponse<RecordPoemViewResult>
  >(`/poems/${encodeURIComponent(id)}/view`);

  return response.data.data;
};

/**
 * POST /api/poems — requires authentication; the backend assigns the author.
 * Both images must contain verified Cloudinary asset metadata.
 */
export const createPoem = async (payload: CreatePoemRequest): Promise<Poem> => {
  const response = await axiosClient.post<ApiSuccessResponse<Poem>>(
    "/poems",
    payload,
  );

  return response.data.data;
};

/**
 * PUT /api/poems/:id — requires authentication and poem ownership or ADMIN role.
 * Omitted image fields retain their stored images.
 */
export const updatePoem = async (
  id: string,
  payload: UpdatePoemRequest,
): Promise<Poem> => {
  const response = await axiosClient.put<ApiSuccessResponse<Poem>>(
    `/poems/${encodeURIComponent(id)}`,
    payload,
  );

  return response.data.data;
};

/**
 * DELETE /api/poems/:id — requires authentication and ADMIN role.
 */
export const deletePoem = async (id: string): Promise<ApiMessageResponse> => {
  const response = await axiosClient.delete<ApiMessageResponse>(
    `/poems/${encodeURIComponent(id)}`,
  );

  return response.data;
};