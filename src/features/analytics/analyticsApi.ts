import type { ApiSuccessResponse } from "@/contracts/api";
import { axiosClient } from "@/lib/api/axiosClient";

export interface PoemAnalytics {
  views: number;
  likes: number;
  comments: number;
}

export const getPoemAnalytics = async (
  poemId: string,
  signal?: AbortSignal,
): Promise<PoemAnalytics> => {
  const response = await axiosClient.get<
    ApiSuccessResponse<PoemAnalytics>
  >(
    `/analytics/poems/${encodeURIComponent(poemId)}`,
    { signal },
  );

  return response.data.data;
};