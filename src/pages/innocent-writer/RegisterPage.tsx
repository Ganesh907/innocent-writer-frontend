import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Feather, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/authContext";
import { getApiErrorMessage, getApiValidationErrors } from "@/lib/api/apiError";
import { Input } from "@/components/ui/input";

export function RegisterPage() {
  const { register, user, isInitializing } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/app", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
      setFieldErrors(getApiValidationErrors(error) ?? {});
    } finally {
      setSubmitting(false);
    }
  };

  if (!isInitializing && user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">You’re already signed in</h1>
            <p className="text-sm text-muted-foreground">
              You can continue to your writing space.
            </p>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                navigate(user.role === "ADMIN" ? "/admin" : "/app", {
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
        <aside className="relative hidden min-h-[38rem] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-foreground/15">
              <Feather className="size-5" />
            </span>
            <span className="font-semibold">Innocent Writer</span>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.22em] opacity-80">
              Start something meaningful
            </p>
            <h2 className="text-4xl font-semibold leading-tight">
              Your next chapter starts with a blank page.
            </h2>
            <p className="max-w-sm text-sm leading-6 opacity-80">
              Create your account and make a little space for your ideas.
            </p>
          </div>

          <p className="text-xs opacity-70">
            Write honestly. Share thoughtfully.
          </p>

          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-16 size-72 rounded-full border border-primary-foreground/20"
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
            <p className="text-sm font-medium text-primary">Get started</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              A few details are all you need to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="register-name">Full name</Label>
              <Input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Your name"
                value={name}
                // onChange={(event) => setName(event.target.value)}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
  setName(event.target.value)
}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={
                  fieldErrors.name ? "register-name-error" : undefined
                }
              />
              {fieldErrors.name && (
                <p
                  id="register-name-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email address</Label>
              <Input
                id="register-email"
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
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "register-email-error" : undefined
                }
              />
              {fieldErrors.email && (
                <p
                  id="register-email-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "register-password-error" : undefined
                }
              />
              {fieldErrors.password && (
                <p
                  id="register-password-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Use a password you do not use on other sites.
              </p>
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
              disabled={submitting || isInitializing}
            >
              {submitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
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