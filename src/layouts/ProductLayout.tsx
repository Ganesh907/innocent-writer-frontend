import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Feather,
  House,
  LogIn,
  LogOut,
  ShieldCheck,
  UserRound,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/authContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex min-h-9 items-center justify-center gap-1.5",
    "rounded-md px-2.5 text-xs font-medium sm:px-3",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");

export function ProductLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isInitializing, logout, hasRole } = useAuth();

  const isPoemDetail = /^\/app\/poems\/[^/]+\/?$/.test(location.pathname);

  const isAuthorPage = location.pathname.startsWith("/app/author");

  useEffect(() => {
    document.documentElement.dataset.product = "poetry";

    return () => {
      if (document.documentElement.dataset.product === "poetry") {
        delete document.documentElement.dataset.product;
      }
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div
      data-product="poetry"
      className="poetry-layout min-h-screen bg-background text-foreground"
    >
      <a
        href="#poetry-main"
        className={[
          "sr-only focus:not-sr-only focus:fixed",
          "focus:left-4 focus:top-4 focus:z-[100]",
          "focus:rounded-md focus:bg-background",
          "focus:p-3 focus:text-foreground focus:shadow-lg",
        ].join(" ")}
      >
        Skip to content
      </a>

      <header className="poetry-navigation sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-5 lg:px-8">
          {/* Brand */}
          <NavLink
            to="/app"
            end
            aria-label="Innocent Writer Poetry home"
            className="flex min-w-0 shrink items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-primary text-primary-foreground">
              <Feather aria-hidden="true" className="size-4" />
            </span>

            <span className="truncate font-serif text-sm font-semibold tracking-tight sm:text-base">
              Innocent Writer
            </span>
          </NavLink>

          {/* Primary navigation */}
          <nav
            aria-label="Poetry navigation"
            className="flex shrink-0 items-center gap-0.5 sm:gap-1"
          >
            <NavLink to="/app" end className={navLinkClass}>
              <House aria-hidden="true" className="size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink to="/app/poems" className={navLinkClass}>
              <BookOpen aria-hidden="true" className="size-3.5" />
              <span>Explore</span>
            </NavLink>

            {user && (
              <NavLink to="/app/author" className={navLinkClass}>
                <UserRound aria-hidden="true" className="size-3.5" />
                <span className="hidden md:inline">My Poems</span>
              </NavLink>
            )}
          </nav>

          {/* Authentication and role-aware actions */}
          <div className="flex shrink-0 items-center gap-1">
            {!isInitializing &&
              (user ? (
                <>
                  {hasRole("ADMIN") && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 px-2 text-xs"
                      onClick={() => navigate("/admin")}
                      aria-label="Open admin dashboard"
                    >
                      <ShieldCheck aria-hidden="true" className="size-4" />
                      <span className="hidden lg:inline">Admin</span>
                    </Button>
                  )}

                  <span className="hidden max-w-28 truncate text-xs text-muted-foreground xl:block">
                    {user.name}
                  </span>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 px-2 text-xs"
                    onClick={handleLogout}
                    aria-label="Sign out"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 px-2 text-xs"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn aria-hidden="true" className="size-4" />
                    <span>Sign in</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    className="h-8 gap-1 px-2 text-xs"
                    onClick={() => navigate("/register")}
                  >
                    <UserPlus aria-hidden="true" className="size-4" />
                    <span className="hidden sm:inline">Join</span>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main
        id="poetry-main"
        className={[
          "mx-auto w-full  px-3 sm:px-5 lg:px-8",
          isPoemDetail ? "pb-5 pt-1 sm:pb-8" : "pb-8 pt-5 sm:pt-8",
          isAuthorPage ? "poetry-author-page" : "",
        ].join(" ")}
      >
        <Outlet />
      </main>

      <footer className="poetry-footer mt-auto border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-3 py-4 text-center text-[11px] text-muted-foreground sm:flex-row sm:px-5 sm:text-left lg:px-8">
          <NavLink
            to="/app"
            className="font-serif font-semibold tracking-wide hover:text-foreground"
          >
            Innocent Writer
          </NavLink>

          <p>Read gently. Write honestly.</p>
        </div>
      </footer>
    </div>
  );
}
