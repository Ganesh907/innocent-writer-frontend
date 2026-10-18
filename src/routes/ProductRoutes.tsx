import { Route, Routes } from "react-router-dom";

import { ProductLayout } from "../layouts/ProductLayout";
import { ProductHomePage } from "../pages/innocent-writer/ProductHomePage";
import { PoemsListPage } from "../pages/innocent-writer/PoemsListPage";
import { PoemDetailPage } from "../pages/innocent-writer/PoemDetailPage";
import { AuthorDashboardPage } from "../pages/innocent-writer/AuthorDashboardPage";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import { PoetryBookPage } from "@/pages/innocent-writer/PoetryBookPage";

export function ProductRoutes() {
  return (
    <Routes>
      <Route element={<ProductLayout />}>
        <Route index element={<ProductHomePage />} />

        <Route path="poems" element={<PoemsListPage />} />
        <Route path="book" element={<PoetryBookPage />} />

        <Route path="poems/:id" element={<PoemDetailPage />} />
        <Route
          path="author"
          element={
            <ProtectedRoute>
              <AuthorDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<ProductHomePage />} />
      </Route>
    </Routes>
  );
}
