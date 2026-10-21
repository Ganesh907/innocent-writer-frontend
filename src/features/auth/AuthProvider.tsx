import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RegisterResult,
  UserRole,
} from "@/contracts/auth";

import { authApi } from "./authApi";
import { AuthContext, type AuthContextValue } from "./authContext";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "./tokenStorage";
import { authQueryKeys } from "@/features/auth/authQueryKeys";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery<AuthUser | null>({
    queryKey: authQueryKeys.me,
    queryFn: async ({ signal }) => {
      if (!getAuthToken()) {
        return null;
      }

      return authApi.getCurrentUser(signal);
    },
    staleTime: 30_000,
    retry: (failureCount, error) => {
      // Don't retry client-side errors such as 401 or 403.
      const status =
        (
          error as {
            status?: number;
            response?: { status?: number };
          }
        )?.status ??
        (
          error as {
            response?: { status?: number };
          }
        )?.response?.status;

      if (status && status >= 400 && status < 500) {
        return false;
      }

      return failureCount < 1;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),

    onSuccess: async ({ token, user }) => {
      setAuthToken(token);

      await queryClient.cancelQueries({
        queryKey: authQueryKeys.me,
      });

      queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authApi.googleLogin(idToken),

    onSuccess: async ({ token, user }) => {
      setAuthToken(token);

      await queryClient.cancelQueries({
        queryKey: authQueryKeys.me,
      });

      queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
  });

  const verifyEmailOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyEmailOtp({ email, otp }),
    onSuccess: async ({ token, user }) => {
      setAuthToken(token);

      await queryClient.cancelQueries({
        queryKey: authQueryKeys.me,
      });

      queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
    },
  });

  const logout = useCallback(() => {
    clearAuthToken();

    queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, null);

    queryClient.removeQueries({
      queryKey: authQueryKeys.all,
      exact: false,
    });
  }, [queryClient]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuthToken();

      queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, null);

      queryClient.removeQueries({
        queryKey: authQueryKeys.all,
        exact: false,
      });
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, [queryClient]);

  const user = currentUserQuery.data ?? null;

  const isInitializing = currentUserQuery.isPending && Boolean(getAuthToken());

  const login = useCallback(
    async (payload: LoginRequest): Promise<AuthUser> => {
      const result = await loginMutation.mutateAsync(payload);

      return result.user;
    },
    [loginMutation],
  );

  const googleLogin = useCallback(
    async (idToken: string): Promise<AuthUser> => {
      const result = await googleLoginMutation.mutateAsync(idToken);

      return result.user;
    },
    [googleLoginMutation],
  );

  const register = useCallback(
    async (payload: RegisterRequest): Promise<RegisterResult> => {
      return registerMutation.mutateAsync(payload);
    },
    [registerMutation],
  );

  const verifyEmailOtp = useCallback(
    async (email: string, otp: string): Promise<AuthUser> => {
      const result = await verifyEmailOtpMutation.mutateAsync({ email, otp });
      return result.user;
    },
    [verifyEmailOtpMutation],
  );

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: user !== null,
      login,
      googleLogin,
      register,
      verifyEmailOtp,
      logout,
      hasRole,
    }),
    [user, isInitializing, login, googleLogin, register, verifyEmailOtp, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// import { useCallback, useEffect, useMemo, type ReactNode } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import type {
//   AuthUser,
//   LoginRequest,
//   RegisterRequest,
//   UserRole,
// } from "@/contracts/auth";

// import { authApi } from "./authApi";
// import { AuthContext, type AuthContextValue } from "./authContext";
// import {
//   AUTH_SESSION_EXPIRED_EVENT,
//   clearAuthToken,
//   getAuthToken,
//   setAuthToken,
// } from "./tokenStorage";
// import { authQueryKeys } from "@/features/auth/authQueryKeys";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const queryClient = useQueryClient();

//   const currentUserQuery = useQuery<AuthUser | null>({
//     queryKey: authQueryKeys.me,
//     queryFn: async ({ signal }) => {
//       if (!getAuthToken()) {
//         return null;
//       }

//       return authApi.getCurrentUser(signal);
//     },
//     staleTime: 30_000,
//     retry: (failureCount, error) => {
//       // Don't retry client-side errors such as 401 or 403.
//       const status =
//         (
//           error as {
//             status?: number;
//             response?: { status?: number };
//           }
//         )?.status ??
//         (
//           error as {
//             response?: { status?: number };
//           }
//         )?.response?.status;

//       if (status && status >= 400 && status < 500) {
//         return false;
//       }

//       return failureCount < 1;
//     },
//   });

//   const loginMutation = useMutation({
//     mutationFn: (payload: LoginRequest) => authApi.login(payload),

//     onSuccess: async ({ token, user }) => {
//       setAuthToken(token);

//       await queryClient.cancelQueries({
//         queryKey: authQueryKeys.me,
//       });

//       queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
//     },
//   });

//   const googleLoginMutation = useMutation({
//     mutationFn: (idToken: string) => authApi.googleLogin(idToken),

//     onSuccess: async ({ token, user }) => {
//       setAuthToken(token);

//       await queryClient.cancelQueries({
//         queryKey: authQueryKeys.me,
//       });

//       queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
//     },
//   });

//   const registerMutation = useMutation({
//     mutationFn: (payload: RegisterRequest) => authApi.register(payload),

//     onSuccess: async ({ token, user }) => {
//       setAuthToken(token);

//       await queryClient.cancelQueries({
//         queryKey: authQueryKeys.me,
//       });

//       queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, user);
//     },
//   });

//   const logout = useCallback(() => {
//     clearAuthToken();

//     queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, null);

//     queryClient.removeQueries({
//       queryKey: authQueryKeys.all,
//       exact: false,
//     });
//   }, [queryClient]);

//   useEffect(() => {
//     const handleSessionExpired = () => {
//       clearAuthToken();

//       queryClient.setQueryData<AuthUser | null>(authQueryKeys.me, null);

//       queryClient.removeQueries({
//         queryKey: authQueryKeys.all,
//         exact: false,
//       });
//     };

//     window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

//     return () => {
//       window.removeEventListener(
//         AUTH_SESSION_EXPIRED_EVENT,
//         handleSessionExpired,
//       );
//     };
//   }, [queryClient]);

//   const user = currentUserQuery.data ?? null;

//   const isInitializing = currentUserQuery.isPending && Boolean(getAuthToken());

//   const login = useCallback(
//     async (payload: LoginRequest): Promise<AuthUser> => {
//       const result = await loginMutation.mutateAsync(payload);

//       return result.user;
//     },
//     [loginMutation],
//   );

//   const googleLogin = useCallback(
//     async (idToken: string): Promise<AuthUser> => {
//       const result = await googleLoginMutation.mutateAsync(idToken);

//       return result.user;
//     },
//     [googleLoginMutation],
//   );

//   const register = useCallback(
//     async (payload: RegisterRequest): Promise<AuthUser> => {
//       const result = await registerMutation.mutateAsync(payload);

//       return result.user;
//     },
//     [registerMutation],
//   );

//   const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       user,
//       isInitializing,
//       isAuthenticated: user !== null,
//       login,
//       googleLogin,
//       register,
//       logout,
//       hasRole,
//     }),
//     [user, isInitializing, login, googleLogin, register, logout, hasRole],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
