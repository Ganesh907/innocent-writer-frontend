import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Feather, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/authContext";
import { getApiErrorMessage, getApiValidationErrors } from "@/lib/api/apiError";
import { Input } from "@/components/ui/input";
import { authApi } from "@/features/auth/authApi";

export function RegisterPage() {
  const { register, verifyEmailOtp, user, isInitializing } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCountdown((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setEmail(result.email);
      setOtpStep(true);
      setOtp("");
      setResendCountdown(60);
      setStatusMessage(
        result.message || "Verification code sent to your email.",
      );
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      setFieldErrors(getApiValidationErrors(error) ?? {});

      if (message.toLowerCase().includes("not verified")) {
        setOtpStep(true);
        setResendCountdown(0);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (verifying || otp.length !== 6) return;

    setVerifying(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      await verifyEmailOtp(email.trim().toLowerCase(), otp);
      navigate("/app", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || resendCountdown > 0) return;

    setResending(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const result = await authApi.resendEmailOtp(email.trim().toLowerCase());
      setStatusMessage(
        result.message || "A new verification code has been sent.",
      );
      setResendCountdown(60);
      setOtp("");
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      const waitMatch = message.match(/wait (\d+) seconds/i);
      if (waitMatch) setResendCountdown(Number(waitMatch[1]));
    } finally {
      setResending(false);
    }
  };

  if (!isInitializing && user) {
    return (
      <main
        data-product="gateway"
        className="poetry-desk grid min-h-[calc(100svh-3rem)] place-items-center px-3 py-4 sm:px-5"
      >
        <div className="gateway-book w-full max-w-xl">
          <div className="gateway-spread">
            <section className="gateway-page gateway-page--right min-w-0 p-5 sm:p-7">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="p-0 pb-4">
                  <h1 className="font-serif text-2xl font-semibold">
                    You’re already signed in
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    You can continue to your writing space.
                  </p>
                </CardHeader>

                <CardContent className="p-0">
                  <Button
                    className="gateway-cta w-full border-0 shadow-none sm:w-auto"
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
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      data-product="gateway"
      className="poetry-desk grid min-h-[calc(100svh-3rem)] place-items-center px-3 py-3 sm:px-5 sm:py-4"
    >
      <div className="gateway-book w-full max-w-5xl">
        <div className="gateway-spread">
          {/* Left book page */}
          <aside className="gateway-page gateway-page--left hidden min-w-0 flex-col justify-between gap-5 p-5 sm:p-6 md:flex lg:p-7">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3 font-semibold tracking-tight"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10">
                  <Feather className="size-5" />
                </span>
                <span>Innocent Writer</span>
              </Link>

              <div className="relative z-10 mt-8 space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.22em] opacity-80">
                  Start something meaningful
                </p>

                <h2 className="font-serif text-3xl font-semibold leading-tight lg:text-4xl">
                  Your next chapter starts with a blank page.
                </h2>

                <p className="max-w-sm text-sm leading-6 opacity-80">
                  Create your account and make a little space for your ideas.
                </p>
              </div>
            </div>

            <p className="text-xs opacity-70">
              Write honestly. Share thoughtfully.
            </p>
          </aside>

          {/* Book spine */}
          <div className="gateway-spine hidden md:block" aria-hidden="true" />

          {/* Right book page */}
          <section className="gateway-page gateway-page--right min-w-0 p-5 sm:p-6 lg:p-7">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-4 flex items-center gap-3 md:hidden">
                <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Feather className="size-5" />
                </span>
                <span className="font-semibold">Innocent Writer</span>
              </div>

              <div className="mb-5 space-y-1.5">
                <p className="text-sm font-medium text-primary">Get started</p>

                <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  Create your account
                </h1>

                <p className="text-sm leading-5 text-muted-foreground">
                  A few details are all you need to get started.
                </p>
              </div>

              {!otpStep ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5"
                  noValidate
                >
                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
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
                        fieldErrors.password
                          ? "register-password-error"
                          : undefined
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
                    className="gateway-cta w-full border-0 shadow-none"
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
              ) : (
                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <h2 className="font-serif text-xl font-semibold">
                      Verify your email
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Enter the 6-digit code we sent to <strong>{email}</strong>
                      . The code expires in 10 minutes.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-otp">Verification code</Label>
                    <Input
                      id="register-otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setOtp(
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      disabled={verifying}
                      aria-describedby="register-otp-help"
                    />
                    <p
                      id="register-otp-help"
                      className="text-xs text-muted-foreground"
                    >
                      Check your inbox and spam folder if you don't see the
                      email.
                    </p>
                  </div>

                  {statusMessage && (
                    <p
                      role="status"
                      className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-foreground"
                    >
                      {statusMessage}
                    </p>
                  )}

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
                    className="gateway-cta w-full border-0 shadow-none"
                    disabled={verifying || otp.length !== 6}
                  >
                    {verifying ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Verifying…
                      </>
                    ) : (
                      <>
                        Verify email <ArrowRight data-icon="inline-end" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => void handleResendOtp()}
                    disabled={resending || resendCountdown > 0}
                  >
                    {resending ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Sending new
                        code…
                      </>
                    ) : resendCountdown > 0 ? (
                      `Resend code in ${resendCountdown}s`
                    ) : (
                      "Resend verification code"
                    )}
                  </Button>

                  <button
                    type="button"
                    className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    onClick={() => {
                      setOtpStep(false);
                      setOtp("");
                      setErrorMessage("");
                      setStatusMessage("");
                    }}
                  >
                    Back to registration
                  </button>
                </form>
              )}

              {!otpStep && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              )}

              <Link
                to="/"
                className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
