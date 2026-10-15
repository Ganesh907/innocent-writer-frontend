import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { UserRole } from "@/contracts/auth";
import { useAuth } from "@/features/auth/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isInitializing, isAuthenticated } = useAuth();

  const location = useLocation();

  if (isInitializing) {
    return (
      <main
        className="flex min-h-[50vh] items-center justify-center bg-background text-foreground"
        aria-live="polite"
        aria-busy="true"
      >
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
