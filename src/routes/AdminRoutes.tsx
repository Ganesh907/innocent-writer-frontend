
import { Route, Routes } from "react-router-dom";
import { ThemeToggle } from "../components/shared/ThemeToggle";

function AdminHome() {
  return (
    <main>
       <ThemeToggle />
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
