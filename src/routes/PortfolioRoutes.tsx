
import { Route, Routes } from "react-router-dom";

function PortfolioHome() {
  return (
    <main>
      <h1>Innocent Writer</h1>
      <p>Portfolio section</p>
    </main>
  );
}

export function PortfolioRoutes() {
  return (
    <Routes>
      <Route index element={<PortfolioHome />} />
      <Route path="*" element={<PortfolioHome />} />
    </Routes>
  );
}
