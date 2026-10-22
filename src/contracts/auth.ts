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

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

export interface RegisterResult {
  message: string;
  email: string;
  requiresEmailVerification: boolean;
}

export interface ResendEmailOtpResult {
  message: string;
  email: string;
}

export interface AuthPayload {
  user: AuthUser;
  token: string;
}

export type AuthApiResponse = ApiSuccessResponse<AuthPayload>;
export type RegisterApiResponse = ApiSuccessResponse<RegisterResult>;
export type ResendEmailOtpApiResponse =
  ApiSuccessResponse<ResendEmailOtpResult>;
export type CurrentUserApiResponse = ApiSuccessResponse<AuthUser>;
