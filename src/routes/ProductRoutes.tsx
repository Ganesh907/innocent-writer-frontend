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
