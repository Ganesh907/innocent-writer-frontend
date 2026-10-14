
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Feather, LoaderCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/authContext";
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from "@/lib/api/apiError";

export function LoginPage() {
  const { login, googleLogin, user, isInitializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const destination = (
    location.state as {
      from?: { pathname?: string };
    } | null
  )?.from?.pathname;

  const continueTo = (role: string) =>
    destination || (role === "ADMIN" ? "/admin" : "/app");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting || googleSubmitting) return;

    setSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const signedInUser = await login({
        email: email.trim(),
        password,
      });

      navigate(continueTo(signedInUser.role), {
        replace: true,
      });
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
      setFieldErrors(getApiValidationErrors(error) ?? {});
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credential: string | undefined) => {
    if (!credential || submitting || googleSubmitting) {
      setErrorMessage("Google sign-in did not return a valid credential. Please try again.");
      return;
    }

    setGoogleSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const signedInUser = await googleLogin(credential);

      navigate(continueTo(signedInUser.role), {
        replace: true,
      });
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  if (!isInitializing && user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">
              You’re already signed in
            </h1>
            <p className="text-sm text-muted-foreground">
              Continue to your workspace.
            </p>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                navigate(continueTo(user.role), {
                  replace: true,
                })
              }
            >
              Continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="grid min-h-[calc(100svh-3rem)] place-items-center px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl md:grid-cols-2">
        <aside className="relative hidden min-h-[34rem] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-foreground/15">
              <Feather className="size-5" />
            </span>
            <span className="font-semibold tracking-tight">
              Innocent Writer
            </span>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.22em] opacity-80">
              Your words, your world
            </p>
            <h2 className="text-4xl font-semibold leading-tight">
              Make room for the stories only you can tell.
            </h2>
            <p className="max-w-sm text-sm leading-6 opacity-80">
              Sign in to continue writing, publishing, and sharing your work.
            </p>
          </div>

          <p className="text-xs opacity-70">
            A home for thoughtful writing.
          </p>

          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-16 size-72 rounded-full border border-primary-foreground/20"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-12 -right-4 size-48 rounded-full border border-primary-foreground/20"
          />
        </aside>

        <section className="min-w-0 p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Feather className="size-5" />
            </span>
            <span className="font-semibold">Innocent Writer</span>
          </div>

          <div className="mb-8 space-y-2">
            <p className="text-sm font-medium text-primary">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Enter your details below to access your writing space.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>

              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                value={email}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
                disabled={submitting || googleSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "login-email-error" : undefined
                }
              />

              {fieldErrors.email && (
                <p id="login-email-error" className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>

              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
                disabled={submitting || googleSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "login-password-error" : undefined
                }
              />

              {fieldErrors.password && (
                <p
                  id="login-password-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting || googleSubmitting || isInitializing}
            >
              {submitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={({ credential }) =>
                void handleGoogleSuccess(credential)
              }
              onError={() => {
                setErrorMessage(
                  "Google sign-in failed. Please try again.",
                );
              }}
              useOneTap={false}
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
              // disabled={submitting || googleSubmitting || isInitializing}
            />
          </div>

          {googleSubmitting && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Signing in with Google…
            </p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Innocent Writer?{" "}
            <Link
              to="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>

          <Link
            to="/"
            className="mt-8 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}