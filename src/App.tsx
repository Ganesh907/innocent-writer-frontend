import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/innocent-writer/LoginPage";
import { RegisterPage } from "./pages/innocent-writer/RegisterPage";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { PortfolioRoutes } from "./routes/PortfolioRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<IndexPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

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

          <Route path="*" element={<IndexPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
