
import { Outlet } from "react-router-dom";

export function ProductLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
