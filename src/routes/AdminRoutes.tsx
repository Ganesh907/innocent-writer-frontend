import { Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";
import { AdminHomePage } from "../pages/admin/AdminHomePage";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="*" element={<AdminHomePage />} />
      </Route>
    </Routes>
  );
}