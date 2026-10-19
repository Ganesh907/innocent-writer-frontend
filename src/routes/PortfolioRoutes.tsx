import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { PortfolioLayout } from "../layouts/PortfolioLayout";
import { PortfolioHomePageSkeleton } from "../components/skeletons/pages";

const PortfolioHomePage = lazy(() => import("../pages/portfolio/PortfolioHomePage").then((module) => ({ default: module.PortfolioHomePage })));

export function PortfolioRoutes() {
  return (
    <Routes>
      <Route element={<PortfolioLayout />}>
        <Route index element={<Suspense fallback={<PortfolioHomePageSkeleton />}><PortfolioHomePage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PortfolioHomePageSkeleton />}><PortfolioHomePage /></Suspense>} />
      </Route>
    </Routes>
  );
}


// import { lazy } from "react";
// import { Route, Routes } from "react-router-dom";

// import { PortfolioLayout } from "../layouts/PortfolioLayout";

// const PortfolioHomePage = lazy(() =>
//   import("../pages/portfolio/PortfolioHomePage").then((module) => ({
//     default: module.PortfolioHomePage,
//   })),
// );

// export function PortfolioRoutes() {
//   return (
//     <Routes>
//       <Route element={<PortfolioLayout />}>
//         <Route index element={<PortfolioHomePage />} />
//         <Route path="*" element={<PortfolioHomePage />} />
//       </Route>
//     </Routes>
//   );
// }

// // import { Route, Routes } from "react-router-dom";

// // import { PortfolioLayout } from "../layouts/PortfolioLayout";
// // import { PortfolioHomePage } from "../pages/portfolio/PortfolioHomePage";

// // export function PortfolioRoutes() {
// //   return (
// //     <Routes>
// //       <Route element={<PortfolioLayout />}>
// //         <Route index element={<PortfolioHomePage />} />
// //         <Route path="*" element={<PortfolioHomePage />} />
// //       </Route>
// //     </Routes>
// //   );
// // }
