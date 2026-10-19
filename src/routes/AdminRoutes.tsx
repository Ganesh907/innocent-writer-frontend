
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";

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
        <Route index element={<AdminDashboardPage />} />
        <Route path="poems" element={<AdminHomePage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        <Route path="users" element={<AdminUsersPage />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

// import { Navigate, Route, Routes } from "react-router-dom";

// import { AdminLayout } from "../layouts/AdminLayout";
// import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
// import { AdminHomePage } from "../pages/admin/AdminHomePage";
// import { AdminModerationPage } from "../pages/admin/AdminModerationPage";
// import { AdminUsersPage } from "../pages/admin/AdminUsersPage";

// export function AdminRoutes() {
//   return (
//     <Routes>
//       <Route element={<AdminLayout />}>
//         <Route index element={<AdminDashboardPage />} />
//         <Route path="poems" element={<AdminHomePage />} />
//         <Route path="moderation" element={<AdminModerationPage />} />
//         <Route path="users" element={<AdminUsersPage />} />

//         <Route path="*" element={<Navigate to="/admin" replace />} />
//       </Route>
//     </Routes>
//   );
// }
