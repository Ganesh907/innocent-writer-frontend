import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import {
  GatewayPageSkeleton,
  LoginPageSkeleton,
  RegisterPageSkeleton,
  PoetryBookPageSkeleton,
  ProductHomePageSkeleton,
  PortfolioHomePageSkeleton,
  PoemsListPageSkeleton,
  PoemDetailPageSkeleton,
  AuthorDashboardPageSkeleton,
  AdminHomePageSkeleton,
  AdminDashboardPageSkeleton,
  AdminModerationPageSkeleton,
  AdminUsersPageSkeleton,
} from "./components/skeletons/pages";

import { MainLayout } from "./layouts/MainLayout";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { ScrollToTop } from "./components/shared/ScrollToTop";

// Lazy-loaded page components
const IndexPage = lazy(() =>
  import("./pages/IndexPage").then((m) => ({
    default: m.IndexPage,
  })),
);

const LoginPage = lazy(() =>
  import("./pages/innocent-writer/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);

const RegisterPage = lazy(() =>
  import("./pages/innocent-writer/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);

const PoetryBookPage = lazy(() =>
  import("./pages/innocent-writer/PoetryBookPage").then((m) => ({
    default: m.PoetryBookPage,
  })),
);

const PortfolioRoutes = lazy(() =>
  import("./routes/PortfolioRoutes").then((m) => ({
    default: m.PortfolioRoutes,
  })),
);

const ProductRoutes = lazy(() =>
  import("./routes/ProductRoutes").then((m) => ({
    default: m.ProductRoutes,
  })),
);

const AdminRoutes = lazy(() =>
  import("./routes/AdminRoutes").then((m) => ({
    default: m.AdminRoutes,
  })),
);

// Select the loading skeleton using the current URL.
// This handles the time when a lazy-loaded route module itself is loading.
function RouteLoadingFallback() {
  const { pathname } = useLocation();

  // Public routes
  if (pathname === "/login") {
    return <LoginPageSkeleton />;
  }

  if (pathname === "/register") {
    return <RegisterPageSkeleton />;
  }

  if (pathname === "/book") {
    return <PoetryBookPageSkeleton />;
  }

  if (pathname === "/") {
    return <GatewayPageSkeleton />;
  }

  // Portfolio routes
  if (pathname === "/portfolio" || pathname.startsWith("/portfolio/")) {
    return <PortfolioHomePageSkeleton />;
  }

  // Product routes
  if (pathname === "/app" || pathname === "/app/") {
    return <ProductHomePageSkeleton />;
  }

  if (pathname === "/app/book") {
    return <PoetryBookPageSkeleton />;
  }

  if (pathname === "/app/poems") {
    return <PoemsListPageSkeleton />;
  }

  if (pathname.startsWith("/app/poems/")) {
    return <PoemDetailPageSkeleton />;
  }

  if (pathname === "/app/author") {
    return <AuthorDashboardPageSkeleton />;
  }

  if (
    pathname.startsWith("/app/") &&
    pathname !== "/app/book" &&
    pathname !== "/app/poems" &&
    !pathname.startsWith("/app/poems/") &&
    pathname !== "/app/author"
  ) {
    return <ProductHomePageSkeleton />;
  }

  // Admin routes
  if (pathname === "/admin" || pathname === "/admin/") {
    return <AdminDashboardPageSkeleton />;
  }

  if (pathname === "/admin/poems") {
    return <AdminHomePageSkeleton />;
  }

  if (pathname === "/admin/moderation") {
    return <AdminModerationPageSkeleton />;
  }

  if (pathname === "/admin/users") {
    return <AdminUsersPageSkeleton />;
  }

  if (pathname.startsWith("/admin/")) {
    return <AdminDashboardPageSkeleton />;
  }

  // Fallback for unknown routes
  return <GatewayPageSkeleton />;
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<GatewayPageSkeleton />}>
                  <IndexPage />
                </Suspense>
              }
            />

            <Route
              path="/book"
              element={
                <Suspense fallback={<PoetryBookPageSkeleton />}>
                  <PoetryBookPage />
                </Suspense>
              }
            />

            <Route
              path="/login"
              element={
                <Suspense fallback={<LoginPageSkeleton />}>
                  <LoginPage />
                </Suspense>
              }
            />

            <Route
              path="/register"
              element={
                <Suspense fallback={<RegisterPageSkeleton />}>
                  <RegisterPage />
                </Suspense>
              }
            />

            <Route path="/portfolio/*" element={<PortfolioRoutes />} />

            <Route path="/app/*" element={<ProductRoutes />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <Suspense fallback={<GatewayPageSkeleton />}>
                  <IndexPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
