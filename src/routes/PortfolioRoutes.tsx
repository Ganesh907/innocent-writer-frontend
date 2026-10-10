
import { Route, Routes } from "react-router-dom";
import { ThemeToggle } from "../components/shared/ThemeToggle";
import { ThemeIntegrationTest } from "../components/shared/ThemeIntegrationTest";

function PortfolioHome() {
  return (
    <main className="space-y-6 p-6">
      <ThemeToggle />

      <h1>Innocent Writer</h1>
      <p>Portfolio section</p>

      <ThemeIntegrationTest />
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

// import { Route, Routes } from "react-router-dom";
// import { ThemeToggle } from "../components/shared/ThemeToggle";

// function PortfolioHome() {
//   return (
//     <main>
//       <ThemeToggle />
//       <h1>Innocent Writer</h1>
//       <p>Portfolio section</p>
//     </main>
//   );
// }

// export function PortfolioRoutes() {
//   return (
//     <Routes>
//       <Route index element={<PortfolioHome />} />
//       <Route path="*" element={<PortfolioHome />} />
//     </Routes>
//   );
// }
