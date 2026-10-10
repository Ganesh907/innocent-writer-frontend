
import { NavLink, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="border-b border-border p-4 sm:p-6 md:border-b-0 md:border-r">
        <h2 className="text-lg font-semibold">Admin</h2>

        <nav
          aria-label="Admin navigation"
          className="mt-4 sm:mt-6"
        >
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </aside>

      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
