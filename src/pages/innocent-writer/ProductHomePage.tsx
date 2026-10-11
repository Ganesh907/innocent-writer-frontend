
import { useNavigate } from "react-router-dom";
import {
  Feather,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/authContext";

export function ProductHomePage() {
  const {
    user,
    isInitializing,
    logout,
    hasRole,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="space-y-8 py-8 sm:py-12">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Feather className="size-6" />
          </span>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Innocent Writer
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Your writing space
            </p>
          </div>
        </div>

        {!isInitializing && (
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <div className="mr-2 min-w-0">
                  <p className="max-w-48 truncate text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {user.role}
                  </p>
                </div>

                {hasRole("ADMIN") && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    <ShieldCheck />
                    Admin
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>

                <Button
                  onClick={() => navigate("/register")}
                >
                  Create account
                </Button>
              </>
            )}
          </div>
        )}
      </header>

      <Card>
        <CardContent className="space-y-3 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            A quiet place for your ideas.
          </h2>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Discover poems from the writing community. Browse the public
            library and search by title; sign in when you want to access
            account features.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => navigate("/app/poems")}>
              <Feather />
              Browse poems
            </Button>
          </div>

          {!isInitializing && !user && (
            <p className="text-sm">
              Sign in when you want to access account features.{" "}
              <button
                type="button"
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign in to continue
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}