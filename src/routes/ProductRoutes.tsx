
import { Route, Routes } from "react-router-dom";
import { ThemeToggle } from "../components/shared/ThemeToggle";

function ProductHome() {
  return (
    <main>
      <ThemeToggle />
      <h1>Innocent Writer</h1>
      <p>Poetry publishing platform</p>
    </main>
  );
}

export function ProductRoutes() {
  return (
    <Routes>
      <Route index element={<ProductHome />} />
      <Route path="*" element={<ProductHome />} />
    </Routes>
  );
}
