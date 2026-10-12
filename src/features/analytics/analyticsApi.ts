import type { ApiSuccessResponse } from "@/contracts/api";
import { axiosClient } from "@/lib/api/axiosClient";

export interface PoemAnalytics {
  views: number;
  likes: number;
  comments: number;
}

export interface AuthorAnalytics {
  poems: number;
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

export const getAuthorAnalytics = async (
  authorId: string,
  signal?: AbortSignal,
): Promise<AuthorAnalytics> => {
  const response = await axiosClient.get<
    ApiSuccessResponse<AuthorAnalytics>
  >(
    `/analytics/authors/${encodeURIComponent(authorId)}`,
    { signal },
  );

  return response.data.data;
};