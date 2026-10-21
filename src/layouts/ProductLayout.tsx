
import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Feather,
  House,
  LogIn,
  LogOut,
  Menu,
  PenLine,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/authContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex min-h-10 items-center justify-center gap-2",
    "rounded-md px-3 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");

const mobileMenuClass = [
  "z-50 w-64 rounded-2xl border border-border p-2 shadow-xl",
  "bg-popover text-popover-foreground",
  "dark:!border-slate-700 dark:!bg-slate-950 dark:!text-slate-100",
  "[&_[role=menuitem]]:rounded-lg",
  "[&_[role=menuitem]]:text-popover-foreground",
  "[&_[role=menuitem]:hover]:bg-muted",
  "dark:[&_[role=menuitem]]:!text-slate-100",
  "dark:[&_[role=menuitem]:hover]:!bg-slate-800",
  "dark:[&_[role=menuitem]:focus]:!bg-slate-800",
].join(" ");

export function ProductLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitializing, logout, hasRole } = useAuth();

  const isPoetryHome =
    location.pathname === "/app" || location.pathname === "/app/";

  const isPoemDetail = /^\/app\/poems\/[^/]+\/?$/.test(location.pathname);
  const isAuthorPage = location.pathname.startsWith("/app/author");
  const isAdmin = Boolean(user && hasRole("ADMIN"));
  const displayName = user?.name?.trim() || "My Account";

  const initials =
    displayName === "My Account"
      ? "U"
      : displayName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0))
          .join("")
          .toUpperCase();

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
      className="poetry-layout flex min-h-screen flex-col bg-background text-foreground"
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

      <header className="poetry-navigation sticky top-0 z-40 border-b border-border bg-white text-black dark:bg-black dark:text-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-3 sm:gap-5 sm:px-6 md:px-8 lg:px-10">
          {/* Brand */}
          <NavLink
            to="/app"
            end
            aria-label="Innocent Writer home"
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-primary text-primary-foreground sm:size-10">
              <Feather aria-hidden="true" className="size-5" />
            </span>
            <span className="truncate font-serif text-base font-semibold tracking-tight sm:text-lg">
              Innocent Writer
            </span>
          </NavLink>

          {/* Desktop navigation */}
          <nav
            aria-label="Poetry navigation"
            className="hidden shrink-0 items-center gap-0.5 sm:flex sm:gap-2"
          >
            <NavLink to="/app" end className={navLinkClass}>
              <House aria-hidden="true" className="size-4" />
              <span>Home</span>
            </NavLink>

            <NavLink to="/app/poems" className={navLinkClass}>
              <Feather aria-hidden="true" className="size-4" />
              <span>Browse Poems</span>
            </NavLink>

            <NavLink to="/app/book" className={navLinkClass}>
              <BookOpen aria-hidden="true" className="size-4" />
              <span>Poetry Collection</span>
            </NavLink>

            {user && (
              <NavLink to="/app/author" className={navLinkClass}>
                <PenLine aria-hidden="true" className="size-4" />
                <span className="hidden md:inline">
                  {isAdmin ? "Author Dashboard" : "My Poetry Space"}
                </span>
              </NavLink>
            )}
          </nav>

          {/* Account, mobile menu and portfolio */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {/* Mobile navigation menu */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 gap-1.5 rounded-xl px-2.5"
                      aria-label="Open main menu"
                    />
                  }
                >
                  <Menu aria-hidden="true" className="size-4" />
                  <span className="text-sm">Menu</span>
                  <ChevronDown aria-hidden="true" className="size-3.5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className={mobileMenuClass}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-2">
                      <span className="block font-serif text-base text-popover-foreground dark:text-slate-100">
                        Innocent Writer
                      </span>
                      <span className="text-xs font-normal text-muted-foreground dark:text-slate-400">
                        Discover poetry. Share your words.
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border dark:bg-slate-700" />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/app")}>
                      <House aria-hidden="true" className="mr-2 size-4" />
                      Home
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("/app/poems")}>
                      <Feather aria-hidden="true" className="mr-2 size-4" />
                      Browse Poems
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("/app/book")}>
                      <BookOpen aria-hidden="true" className="mr-2 size-4" />
                      Poetry Collection
                    </DropdownMenuItem>

                    {user && (
                      <DropdownMenuItem
                        onClick={() => navigate("/app/author")}
                      >
                        <PenLine aria-hidden="true" className="mr-2 size-4" />
                        {isAdmin ? "Author Dashboard" : "My Poetry Space"}
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                      <BriefcaseBusiness
                        aria-hidden="true"
                        className="mr-2 size-4"
                      />
                      Portfolio
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border dark:bg-slate-700" />

                  {user ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="px-3 text-muted-foreground dark:text-slate-400">
                          {displayName}
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>

                      <DropdownMenuGroup>
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => navigate("/admin")}
                          >
                            <ShieldCheck
                              aria-hidden="true"
                              className="mr-2 size-4"
                            />
                            Admin Dashboard
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut aria-hidden="true" className="mr-2 size-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      {/* <DropdownMenuLabel className="px-3">
                        Welcome, writer
                      </DropdownMenuLabel> */}

                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        <LogIn aria-hidden="true" className="mr-2 size-4" />
                        Sign in
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate("/register")}>
                        <UserPlus
                          aria-hidden="true"
                          className="mr-2 size-4"
                        />
                        Create account
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop account dropdown */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 max-w-40 gap-2 rounded-full px-2 sm:max-w-56 sm:px-3"
                      aria-label="Open account menu"
                    />
                  }
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {user ? initials : <UserRound className="size-4" />}
                  </span>

                  <span className="truncate text-sm">
                    {isInitializing
                      ? "Account"
                      : user
                        ? displayName
                        : "Account"}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className="size-3.5 shrink-0 opacity-70"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={6}
                  className="w-56 min-w-56 bg-popover text-popover-foreground dark:!bg-slate-950 dark:!text-slate-100"
                >
                  {user ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal">
                          <span className="block truncate text-sm font-medium text-foreground dark:text-slate-100">
                            {displayName}
                          </span>
                          <span className="block text-xs text-muted-foreground dark:text-slate-400">
                            {isAdmin ? "Administrator" : "Writer"}
                          </span>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        {isAdmin ? (
                          <DropdownMenuItem
                            onClick={() => navigate("/admin")}
                          >
                            <ShieldCheck
                              aria-hidden="true"
                              className="mr-2 size-4"
                            />
                            Admin Dashboard
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => navigate("/app/author")}
                          >
                            <PenLine
                              aria-hidden="true"
                              className="mr-2 size-4"
                            />
                            My Poetry Space
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut aria-hidden="true" className="mr-2 size-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          Welcome, writer
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate("/login")}>
                          <LogIn aria-hidden="true" className="mr-2 size-4" />
                          Sign in
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate("/register")}>
                          <UserPlus
                            aria-hidden="true"
                            className="mr-2 size-4"
                          />
                          Create account
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Portfolio button — desktop only; mobile uses the menu */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="hidden h-10 shrink-0 gap-1 px-2 sm:inline-flex sm:gap-2 sm:px-3"
              onClick={() => navigate("/portfolio")}
            >
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-4"
              />
              <span>Portfolio</span>
            </Button>
          </div>
        </div>
      </header>

      <main
        id="poetry-main"
        className={[
          "w-full flex-1",
          isPoetryHome
            ? "p-0"
            : [
                "mx-auto px-3 sm:px-5 lg:px-8",
                isPoemDetail
                  ? "pb-5 pt-1 sm:pb-8"
                  : "pb-8 pt-5 sm:pt-8",
                isAuthorPage ? "poetry-author-page" : "",
              ].join(" "),
        ].join(" ")}
      >
        <Outlet />
      </main>

      <footer
        className={[
          "poetry-footer mt-auto border-t border-border/70",
          isPoetryHome ? "hidden" : "",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-3 py-4 text-center text-[11px] text-muted-foreground sm:flex-row sm:px-5 sm:text-left lg:px-8">
          <NavLink
            to="/app"
            className="font-serif font-semibold tracking-wide hover:text-foreground"
          >
            Innocent Writer
          </NavLink>
          <p>Words that connect hearts.</p>
        </div>
      </footer>
    </div>
  );
}