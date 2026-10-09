
import { Navigate, Route, Routes } from "react-router-dom";

import { PortfolioRoutes } from "./routes/PortfolioRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portfolio" replace />} />
      <Route path="/portfolio/*" element={<PortfolioRoutes />} />
      <Route path="/app/*" element={<ProductRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/portfolio" replace />} />
    </Routes>
  );
}

export default App;
