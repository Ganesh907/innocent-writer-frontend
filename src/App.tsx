
import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { IndexPage } from "./pages/IndexPage";
import { PortfolioRoutes } from "./routes/PortfolioRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<IndexPage />} />
        <Route
          path="/portfolio/*"
          element={<PortfolioRoutes />}
        />
        <Route path="/app/*" element={<ProductRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<IndexPage />} />
      </Route>
    </Routes>
  );
}

export default App;
