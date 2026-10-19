import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";
import {
  AdminDashboardPageSkeleton,
  AdminHomePageSkeleton,
  AdminModerationPageSkeleton,
  AdminUsersPageSkeleton,
} from "../components/skeletons/pages";

const AdminDashboardPage = lazy(() =>
  import("../pages/admin/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const AdminHomePage = lazy(() =>
  import("../pages/admin/AdminHomePage").then((module) => ({
    default: module.AdminHomePage,
  })),
);
const AdminModerationPage = lazy(() =>
  import("../pages/admin/AdminModerationPage").then((module) => ({
    default: module.AdminModerationPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("../pages/admin/AdminUsersPage").then((module) => ({
    default: module.AdminUsersPage,
  })),
);

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<AdminDashboardPageSkeleton />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="poems"
          element={
            <Suspense fallback={<AdminHomePageSkeleton />}>
              <AdminHomePage />
            </Suspense>
          }
        />
        <Route
          path="moderation"
          element={
            <Suspense fallback={<AdminModerationPageSkeleton />}>
              <AdminModerationPage />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<AdminUsersPageSkeleton />}>
              <AdminUsersPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
