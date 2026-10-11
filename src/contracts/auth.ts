import type { ApiSuccessResponse } from "@/contracts/api";

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthPayload {
  user: AuthUser;
  token: string;
}

export type AuthApiResponse = ApiSuccessResponse<AuthPayload>;
export type CurrentUserApiResponse = ApiSuccessResponse<AuthUser>;