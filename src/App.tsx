
import { lazy, Suspense } from "react";
import { GatewayPageSkeleton, LoginPageSkeleton, RegisterPageSkeleton, PoetryBookPageSkeleton } from "./components/skeletons/pages";
import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { PageSkeleton } from "./components/skeletons";

const IndexPage = lazy(() =>
  import("./pages/IndexPage").then((module) => ({
    default: module.IndexPage,
  })),
);

const LoginPage = lazy(() =>
  import("./pages/innocent-writer/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

const RegisterPage = lazy(() =>
  import("./pages/innocent-writer/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);

const PoetryBookPage = lazy(() =>
  import("./pages/innocent-writer/PoetryBookPage").then((module) => ({
    default: module.PoetryBookPage,
  })),
);

const PortfolioRoutes = lazy(() =>
  import("./routes/PortfolioRoutes").then((module) => ({
    default: module.PortfolioRoutes,
  })),
);

const ProductRoutes = lazy(() =>
  import("./routes/ProductRoutes").then((module) => ({
    default: module.ProductRoutes,
  })),
);

const AdminRoutes = lazy(() =>
  import("./routes/AdminRoutes").then((module) => ({
    default: module.AdminRoutes,
  })),
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageSkeleton label="Loading page" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Suspense fallback={<GatewayPageSkeleton />}><IndexPage /></Suspense>} />

            <Route path="/book" element={<Suspense fallback={<PoetryBookPageSkeleton />}><PoetryBookPage /></Suspense>} />

            <Route path="/login" element={<Suspense fallback={<LoginPageSkeleton />}><LoginPage /></Suspense>} />

            <Route path="/register" element={<Suspense fallback={<RegisterPageSkeleton />}><RegisterPage /></Suspense>} />

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
      </Suspense>
    </AuthProvider>
  );
}

export default App;



// import { lazy, Suspense } from "react";
// import { Route, Routes } from "react-router-dom";

// import { MainLayout } from "./layouts/MainLayout";
// import { AuthProvider } from "./features/auth/AuthProvider";
// import { ProtectedRoute } from "./components/shared/ProtectedRoute";
// import { PageSkeleton } from "./components/skeletons";

// const IndexPage = lazy(() =>
//   import("./pages/IndexPage").then((module) => ({
//     default: module.IndexPage,
//   })),
// );

// const LoginPage = lazy(() =>
//   import("./pages/innocent-writer/LoginPage").then((module) => ({
//     default: module.LoginPage,
//   })),
// );

// const RegisterPage = lazy(() =>
//   import("./pages/innocent-writer/RegisterPage").then((module) => ({
//     default: module.RegisterPage,
//   })),
// );

// const PoetryBookPage = lazy(() =>
//   import("./pages/innocent-writer/PoetryBookPage").then((module) => ({
//     default: module.PoetryBookPage,
//   })),
// );

// const PortfolioRoutes = lazy(() =>
//   import("./routes/PortfolioRoutes").then((module) => ({
//     default: module.PortfolioRoutes,
//   })),
// );

// const ProductRoutes = lazy(() =>
//   import("./routes/ProductRoutes").then((module) => ({
//     default: module.ProductRoutes,
//   })),
// );

// const AdminRoutes = lazy(() =>
//   import("./routes/AdminRoutes").then((module) => ({
//     default: module.AdminRoutes,
//   })),
// );

// function App() {
//   return (
//     <AuthProvider>
//       <Suspense fallback={<PageSkeleton label="Loading page" />}>
//         <Routes>
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<IndexPage />} />

//             <Route path="/book" element={<PoetryBookPage />} />

//             <Route path="/login" element={<LoginPage />} />

//             <Route path="/register" element={<RegisterPage />} />

//             <Route path="/portfolio/*" element={<PortfolioRoutes />} />

//             <Route path="/app/*" element={<ProductRoutes />} />

//             <Route
//               path="/admin/*"
//               element={
//                 <ProtectedRoute requiredRole="ADMIN">
//                   <AdminRoutes />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="*" element={<IndexPage />} />
//           </Route>
//         </Routes>
//       </Suspense>
//     </AuthProvider>
//   );
// }

// export default App;


// // import { Route, Routes } from "react-router-dom";

// // import { MainLayout } from "./layouts/MainLayout";
// // import { IndexPage } from "./pages/IndexPage";
// // import { LoginPage } from "./pages/innocent-writer/LoginPage";
// // import { RegisterPage } from "./pages/innocent-writer/RegisterPage";
// // import { AuthProvider } from "./features/auth/AuthProvider";
// // import { ProtectedRoute } from "./components/shared/ProtectedRoute";
// // import { PortfolioRoutes } from "./routes/PortfolioRoutes";
// // import { ProductRoutes } from "./routes/ProductRoutes";
// // import { AdminRoutes } from "./routes/AdminRoutes";
// // import { PoetryBookPage } from "./pages/innocent-writer/PoetryBookPage";

// // function App() {
// //   return (
// //     <AuthProvider>
// //       <Routes>
// //         <Route element={<MainLayout />}>
// //           <Route path="/" element={<IndexPage />} />

// //           <Route path="/book" element={<PoetryBookPage />} />

// //           <Route path="/login" element={<LoginPage />} />

// //           <Route path="/register" element={<RegisterPage />} />

// //           <Route path="/portfolio/*" element={<PortfolioRoutes />} />

// //           <Route path="/app/*" element={<ProductRoutes />} />

// //           <Route
// //             path="/admin/*"
// //             element={
// //               <ProtectedRoute requiredRole="ADMIN">
// //                 <AdminRoutes />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route path="*" element={<IndexPage />} />
// //         </Route>
// //       </Routes>
// //     </AuthProvider>
// //   );
// // }

// // export default App;
