import type { ApiSuccessResponse } from "@/contracts/api";
import { axiosClient } from "@/lib/api/axiosClient";

export interface PoemComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  poemId: string;
  user: {
    id: string;
    name: string;
  };
}

export const getCommentsByPoem = async (
  poemId: string,
  signal?: AbortSignal,
): Promise<PoemComment[]> => {
  const response = await axiosClient.get<
    ApiSuccessResponse<PoemComment[]>
  >(
    `/poems/${encodeURIComponent(poemId)}/comments`,
    { signal },
  );

  return response.data.data;
};

export const addPoemComment = async (
  poemId: string,
  content: string,
): Promise<PoemComment> => {
  const response = await axiosClient.post<
    ApiSuccessResponse<PoemComment>
  >(
    `/poems/${encodeURIComponent(poemId)}/comments`,
    { content },
  );

  return response.data.data;
};

export const deletePoemComment = async (
  commentId: string,
): Promise<void> => {
  await axiosClient.delete<
    ApiSuccessResponse<{ message: string }>
  >(
    `/poems/comments/${encodeURIComponent(commentId)}`,
  );
};