
import { Outlet } from "react-router-dom";

import { ThemeToggle } from "../components/shared/ThemeToggle";

export function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <ThemeToggle />
      <Outlet />
    </div>
  );
}