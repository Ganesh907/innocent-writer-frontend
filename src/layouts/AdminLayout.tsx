import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/authContext";

export function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-border p-4 sm:p-6 md:border-b-0 md:border-r">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Innocent Writer
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Admin console
          </h2>
        </div>

        {user && (
          <div className="mt-6 rounded-xl bg-muted p-3">
            <p className="break-words text-sm font-medium">
              {user.name}
            </p>
            <p className="break-all text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Role: {user.role}
            </p>
          </div>
        )}

        {hasRole("ADMIN") && (
          <nav
            aria-label="Admin navigation"
            className="mt-5 space-y-1"
          >
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              Dashboard
            </NavLink>
          </nav>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:mt-auto">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/app")}
          >
            Open product
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}