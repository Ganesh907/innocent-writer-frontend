
import type {
  ApiMessageResponse,
  ApiSuccessResponse,
} from "@/contracts/api";
import type {
  CreatePoemRequest,
  GetPoemsParams,
  Poem,
  PoemListResponse,
  UpdatePoemRequest,
} from "@/contracts/poem";
import { axiosClient } from "@/lib/api/axiosClient";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Converts a browser File to a Base64 data URI.
 * The backend remains responsible for authoritative validation.
 */
export const imageFileToDataUri = (
  file: File,
): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return Promise.reject(
      new Error("Choose a JPEG, PNG, or WebP image."),
    );
  }

  if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    return Promise.reject(
      new Error(
        "Each image must be larger than 0 bytes and no larger than 5 MB.",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        if (
          typeof reader.result !== "string" ||
          !reader.result.startsWith("data:")
        ) {
          reject(
            new Error("The selected image could not be read."),
          );
          return;
        }

        resolve(reader.result);
      },
      { once: true },
    );

    reader.addEventListener(
      "error",
      () => {
        reject(
          new Error("The selected image could not be read."),
        );
      },
      { once: true },
    );

    reader.readAsDataURL(file);
  });
};

/** GET /api/poems?page=&limit=&title=&authorId= */
export const getPoems = async (
  params: GetPoemsParams = {},
): Promise<PoemListResponse> => {
  const response = await axiosClient.get<PoemListResponse>(
    "/poems",
    { params },
  );

  return response.data;
};

/** GET /api/poems/:id — public endpoint. */
export const getPoemById = async (
  id: string,
): Promise<Poem> => {
  const response = await axiosClient.get<
    ApiSuccessResponse<Poem>
  >(`/poems/${encodeURIComponent(id)}`);

  return response.data.data;
};

/**
 * POST /api/poems — requires authentication and ADMIN role.
 * Both images must be valid Base64 data URIs.
 */
export const createPoem = async (
  payload: CreatePoemRequest,
): Promise<Poem> => {
  const response = await axiosClient.post<
    ApiSuccessResponse<Poem>
  >("/poems", payload);

  return response.data.data;
};

/**
 * PUT /api/poems/:id — requires authentication and ADMIN role.
 * Omitted image fields retain their stored images.
 */
export const updatePoem = async (
  id: string,
  payload: UpdatePoemRequest,
): Promise<Poem> => {
  const response = await axiosClient.put<
    ApiSuccessResponse<Poem>
  >(
    `/poems/${encodeURIComponent(id)}`,
    payload,
  );

  return response.data.data;
};

/**
 * DELETE /api/poems/:id — requires authentication and ADMIN role.
 */
export const deletePoem = async (
  id: string,
): Promise<ApiMessageResponse> => {
  const response = await axiosClient.delete<
    ApiMessageResponse
  >(`/poems/${encodeURIComponent(id)}`);

  return response.data;
};
