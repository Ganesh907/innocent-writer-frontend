import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { ProductLayout } from "../layouts/ProductLayout";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import { ProductHomePageSkeleton, PoemsListPageSkeleton, PoemDetailPageSkeleton, AuthorDashboardPageSkeleton, PoetryBookPageSkeleton } from "../components/skeletons/pages";

const ProductHomePage = lazy(() => import("../pages/innocent-writer/ProductHomePage").then((module) => ({ default: module.ProductHomePage })));
const PoemsListPage = lazy(() => import("../pages/innocent-writer/PoemsListPage").then((module) => ({ default: module.PoemsListPage })));
const PoemDetailPage = lazy(() => import("../pages/innocent-writer/PoemDetailPage").then((module) => ({ default: module.PoemDetailPage })));
const AuthorDashboardPage = lazy(() => import("../pages/innocent-writer/AuthorDashboardPage").then((module) => ({ default: module.AuthorDashboardPage })));
const PoetryBookPage = lazy(() => import("../pages/innocent-writer/PoetryBookPage").then((module) => ({ default: module.PoetryBookPage })));

export function ProductRoutes() {
  return (
    <Routes>
      <Route element={<ProductLayout />}>
        <Route index element={<Suspense fallback={<ProductHomePageSkeleton />}><ProductHomePage /></Suspense>} />
        <Route path="poems" element={<Suspense fallback={<PoemsListPageSkeleton />}><PoemsListPage /></Suspense>} />
        <Route path="book" element={<Suspense fallback={<PoetryBookPageSkeleton />}><PoetryBookPage /></Suspense>} />
        <Route path="poems/:id" element={<Suspense fallback={<PoemDetailPageSkeleton />}><PoemDetailPage /></Suspense>} />
        <Route path="author" element={<ProtectedRoute><Suspense fallback={<AuthorDashboardPageSkeleton />}><AuthorDashboardPage /></Suspense></ProtectedRoute>} />
        <Route path="*" element={<Suspense fallback={<ProductHomePageSkeleton />}><ProductHomePage /></Suspense>} />
      </Route>
    </Routes>
  );
}


// import { lazy } from "react";
// import { Route, Routes } from "react-router-dom";

// import { ProductLayout } from "../layouts/ProductLayout";
// import { ProtectedRoute } from "../components/shared/ProtectedRoute";

// const ProductHomePage = lazy(() =>
//   import("../pages/innocent-writer/ProductHomePage").then((module) => ({
//     default: module.ProductHomePage,
//   })),
// );

// const PoemsListPage = lazy(() =>
//   import("../pages/innocent-writer/PoemsListPage").then((module) => ({
//     default: module.PoemsListPage,
//   })),
// );

// const PoemDetailPage = lazy(() =>
//   import("../pages/innocent-writer/PoemDetailPage").then((module) => ({
//     default: module.PoemDetailPage,
//   })),
// );

// const AuthorDashboardPage = lazy(() =>
//   import("../pages/innocent-writer/AuthorDashboardPage").then((module) => ({
//     default: module.AuthorDashboardPage,
//   })),
// );

// const PoetryBookPage = lazy(() =>
//   import("../pages/innocent-writer/PoetryBookPage").then((module) => ({
//     default: module.PoetryBookPage,
//   })),
// );

// export function ProductRoutes() {
//   return (
//     <Routes>
//       <Route element={<ProductLayout />}>
//         <Route index element={<ProductHomePage />} />

//         <Route path="poems" element={<PoemsListPage />} />
//         <Route path="book" element={<PoetryBookPage />} />

//         <Route path="poems/:id" element={<PoemDetailPage />} />

//         <Route
//           path="author"
//           element={
//             <ProtectedRoute>
//               <AuthorDashboardPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<ProductHomePage />} />
//       </Route>
//     </Routes>
//   );
// }

// // import { Route, Routes } from "react-router-dom";

// // import { ProductLayout } from "../layouts/ProductLayout";
// // import { ProductHomePage } from "../pages/innocent-writer/ProductHomePage";
// // import { PoemsListPage } from "../pages/innocent-writer/PoemsListPage";
// // import { PoemDetailPage } from "../pages/innocent-writer/PoemDetailPage";
// // import { AuthorDashboardPage } from "../pages/innocent-writer/AuthorDashboardPage";
// // import { ProtectedRoute } from "../components/shared/ProtectedRoute";
// // import { PoetryBookPage } from "@/pages/innocent-writer/PoetryBookPage";

// // export function ProductRoutes() {
// //   return (
// //     <Routes>
// //       <Route element={<ProductLayout />}>
// //         <Route index element={<ProductHomePage />} />

// //         <Route path="poems" element={<PoemsListPage />} />
// //         <Route path="book" element={<PoetryBookPage />} />

// //         <Route path="poems/:id" element={<PoemDetailPage />} />
// //         <Route
// //           path="author"
// //           element={
// //             <ProtectedRoute>
// //               <AuthorDashboardPage />
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route path="*" element={<ProductHomePage />} />
// //       </Route>
// //     </Routes>
// //   );
// // }
