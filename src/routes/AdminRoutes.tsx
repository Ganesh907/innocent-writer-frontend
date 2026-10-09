
import { Route, Routes } from "react-router-dom";

function AdminHome() {
  return (
    <main>
      <h1>Admin</h1>
      <p>Administrative section</p>
    </main>
  );
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="*" element={<AdminHome />} />
    </Routes>
  );
}
