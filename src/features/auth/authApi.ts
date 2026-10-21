import type {
  AuthApiResponse,
  AuthPayload,
  CurrentUserApiResponse,
  LoginRequest,
  RegisterApiResponse,
  RegisterRequest,
  RegisterResult,
  ResendEmailOtpApiResponse,
  ResendEmailOtpResult,
  VerifyEmailOtpRequest,
} from "@/contracts/auth";
import { axiosClient } from "@/lib/api/axiosClient";

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthPayload> {
    const response = await axiosClient.post<AuthApiResponse>(
      "/auth/login",
      payload,
    );

    return response.data.data;
  },

  async googleLogin(idToken: string): Promise<AuthPayload> {
    const response = await axiosClient.post<AuthApiResponse>("/auth/google", {
      idToken,
    });

    return response.data.data;
  },

  async register(payload: RegisterRequest): Promise<RegisterResult> {
    const response = await axiosClient.post<RegisterApiResponse>(
      "/auth/register",
      payload,
    );

    return response.data.data;
  },

  async verifyEmailOtp(payload: VerifyEmailOtpRequest): Promise<AuthPayload> {
    const response = await axiosClient.post<AuthApiResponse>(
      "/auth/verify-email",
      payload,
    );

    return response.data.data;
  },

  async resendEmailOtp(email: string): Promise<ResendEmailOtpResult> {
    const response = await axiosClient.post<ResendEmailOtpApiResponse>(
      "/auth/resend-otp",
      { email },
    );

    return response.data.data;
  },

  async getCurrentUser(
    signal?: AbortSignal,
  ): Promise<CurrentUserApiResponse["data"]> {
    const response = await axiosClient.get<CurrentUserApiResponse>("/auth/me", {
      signal,
    });

    return response.data.data;
  },
};

// import type {
//   AuthApiResponse,
//   AuthPayload,
//   CurrentUserApiResponse,
//   LoginRequest,
//   RegisterRequest,
// } from "@/contracts/auth";
// import { axiosClient } from "@/lib/api/axiosClient";

// export const authApi = {
//   async login(payload: LoginRequest): Promise<AuthPayload> {
//     const response = await axiosClient.post<AuthApiResponse>(
//       "/auth/login",
//       payload,
//     );

//     return response.data.data;
//   },

//   async googleLogin(idToken: string): Promise<AuthPayload> {
//     const response = await axiosClient.post<AuthApiResponse>("/auth/google", {
//       idToken,
//     });

//     return response.data.data;
//   },

//   async register(payload: RegisterRequest): Promise<AuthPayload> {
//     const response = await axiosClient.post<AuthApiResponse>(
//       "/auth/register",
//       payload,
//     );

//     return response.data.data;
//   },

//   async getCurrentUser(
//     signal?: AbortSignal,
//   ): Promise<CurrentUserApiResponse["data"]> {
//     const response = await axiosClient.get<CurrentUserApiResponse>("/auth/me", {
//       signal,
//     });

//     return response.data.data;
//   },
// };
