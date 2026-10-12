import type { ApiSuccessResponse } from "@/contracts/api";
import { axiosClient } from "@/lib/api/axiosClient";

export interface TogglePoemLikeResult {
  liked: boolean;
}

export const togglePoemLike = async (
  poemId: string,
): Promise<TogglePoemLikeResult> => {
  const response = await axiosClient.post<
    ApiSuccessResponse<TogglePoemLikeResult>
  >(
    `/poems/${encodeURIComponent(poemId)}/like`,
  );

  return response.data.data;
};