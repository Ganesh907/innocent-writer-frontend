import { Route, Routes } from "react-router-dom";

import { PortfolioLayout } from "../layouts/PortfolioLayout";
import { PortfolioHomePage } from "../pages/portfolio/PortfolioHomePage";

export function PortfolioRoutes() {
  return (
    <Routes>
      <Route element={<PortfolioLayout />}>
        <Route index element={<PortfolioHomePage />} />
        <Route path="*" element={<PortfolioHomePage />} />
      </Route>
    </Routes>
  );
}
