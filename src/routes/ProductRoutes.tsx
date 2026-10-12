
import { Route, Routes } from "react-router-dom";

import { ProductLayout } from "../layouts/ProductLayout";
import { ProductHomePage } from "../pages/innocent-writer/ProductHomePage";
import { PoemsListPage } from "../pages/innocent-writer/PoemsListPage";
import { PoemDetailPage } from "../pages/innocent-writer/PoemDetailPage";

export function ProductRoutes() {
  return (
    <Routes>
      <Route element={<ProductLayout />}>
        <Route index element={<ProductHomePage />} />

        <Route
          path="poems"
          element={<PoemsListPage />}
        />

        <Route
          path="poems/:id"
          element={<PoemDetailPage />}
        />

        <Route
          path="*"
          element={<ProductHomePage />}
        />
      </Route>
    </Routes>
  );
}
