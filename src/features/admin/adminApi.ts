import type { ApiSuccessResponse, PaginationMeta } from "@/contracts/api";
import type { UserRole } from "@/contracts/auth";
import type { Poem } from "@/contracts/poem";
import { axiosClient } from "@/lib/api/axiosClient";

export interface AdminPlatformAnalytics {
  totalUsers: number;
  totalPoems: number;
  publishedPoems: number;
  unpublishedPoems: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
}

export interface AdminUsersResponse extends ApiSuccessResponse<AdminUser[]> {
  pagination: PaginationMeta & {
    total: number;
    totalPages: number;
  };
}

export interface AdminPoemsParams {
  page?: number;
  limit?: number;
  title?: string;
  published?: boolean;
}

export interface AdminPoemsResponse extends ApiSuccessResponse<Poem[]> {
  pagination: PaginationMeta & {
    total: number;
    totalPages: number;
  };
}

export interface AdminPoemPublication {
  id: string;
  title: string;
  published: boolean;
  updatedAt: string;
}

export const getAdminAnalytics = async (
  signal?: AbortSignal,
): Promise<AdminPlatformAnalytics> => {
  const response = await axiosClient.get<
    ApiSuccessResponse<AdminPlatformAnalytics>
  >("/admin/analytics", { signal });

  return response.data.data;
};

export const getAdminUsers = async (
  params: AdminUsersParams = {},
  signal?: AbortSignal,
): Promise<AdminUsersResponse> => {
  const response = await axiosClient.get<AdminUsersResponse>("/admin/users", {
    params,
    signal,
  });

  return response.data;
};

export const updateAdminUserRole = async (
  id: string,
  role: UserRole,
): Promise<AdminUser> => {
  const response = await axiosClient.patch<ApiSuccessResponse<AdminUser>>(
    `/admin/users/${encodeURIComponent(id)}/role`,
    { role },
  );

  return response.data.data;
};

export const getAdminPoems = async (
  params: AdminPoemsParams = {},
  signal?: AbortSignal,
): Promise<AdminPoemsResponse> => {
  const response = await axiosClient.get<AdminPoemsResponse>("/admin/poems", {
    params,
    signal,
  });

  return response.data;
};

export const setAdminPoemPublication = async (
  id: string,
  published: boolean,
): Promise<AdminPoemPublication> => {
  const response = await axiosClient.patch<
    ApiSuccessResponse<AdminPoemPublication>
  >(`/admin/poems/${encodeURIComponent(id)}/publication`, { published });

  return response.data.data;
};
