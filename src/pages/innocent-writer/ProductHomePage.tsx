import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Feather, PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/authContext";

export function ProductHomePage() {
  const navigate = useNavigate();
  const { user, isInitializing, hasRole } = useAuth();

  const isAdmin = Boolean(user && hasRole("ADMIN"));

  const writingDestination = !user
    ? "/login"
    : isAdmin
      ? "/admin"
      : "/app/author";

  const writingAction = !user
    ? "Sign in to write"
    : isAdmin
      ? "Admin workspace"
      : "My writing desk";

  return (
    <main className="space-y-4 py-3 sm:space-y-5 sm:py-5">
      {/* Illustrated hero */}
      <section
        aria-labelledby="poetry-home-title"
        className="poetry-hero rounded-lg border border-border/60 shadow-lg"
      >
        <img
          src="/images/innocent-writer-hero.png"
          alt="An illustrated writer surrounded by books, flowers, birds, and warm lamplight"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b2a]/95 via-[#101b2a]/75 to-[#101b2a]/25 dark:from-[#07111d]/95 dark:via-[#07111d]/85 dark:to-[#07111d]/40"
        />

        <div className="poetry-hero-content space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm sm:text-xs">
            <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />A quiet
            corner for words
          </span>

          <h1 id="poetry-home-title" className="poetry-hero-title">
            Find the words
            <br />
            that feel like you.
          </h1>

          <p className="poetry-hero-description">
            Read a little. Feel a little more understood. Discover poems written
            by people who have felt it too.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-center">
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/app/poems")}
              className="h-10 gap-2 border border-white/20 bg-[#9b3d54] px-4 text-sm text-white shadow-md hover:bg-[#7f2f43] dark:bg-[#f0a3b5] dark:text-[#20151a] dark:hover:bg-[#f7bfcc]"
            >
              Explore poems
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>

            {!isInitializing && !user && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => navigate("/register")}
                className="h-10 border-white/50 bg-white/10 px-4 text-sm text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                Join the community
              </Button>
            )}

            {!isInitializing && user && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => navigate(writingDestination)}
                className="h-10 gap-2 border-white/50 bg-white/10 px-4 text-sm text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <PenLine aria-hidden="true" className="size-4" />
                {writingAction}
              </Button>
            )}
          </div>

          {!isInitializing && (
            <p className="text-xs leading-5 text-white/80">
              {user
                ? `Welcome back, ${user.name}. Your next page is waiting.`
                : "Read freely. Sign in when you want to like or comment."}
            </p>
          )}
        </div>
      </section>

      {/* Compact destinations */}
      <section
        aria-label="Explore Innocent Writer"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => navigate("/app/poems")}
          className="group flex min-h-[84px] min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-primary/15 bg-primary/10 text-primary">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-serif text-base font-semibold leading-5">
              The poetry library
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Explore poems and discover a line that stays with you.
            </span>
          </span>

          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        <button
          type="button"
          onClick={() => navigate(writingDestination)}
          className="group flex min-h-[84px] min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-primary/15 bg-primary/10 text-primary">
            <Feather aria-hidden="true" className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-serif text-base font-semibold leading-5">
              {user ? "Your writing desk" : "Share your voice"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {user
                ? isAdmin
                  ? "Manage the platform from your admin workspace."
                  : "Create, edit, and manage your own poems."
                : "Sign in to publish poems and join the conversation."}
            </span>
          </span>

          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </section>

      {/* Small literary footer note */}
      <div className="flex items-center justify-center gap-2 py-1 text-center text-[10px] tracking-wide text-muted-foreground sm:text-xs">
        <span className="h-px w-7 bg-border" />
        <span>Every feeling deserves its words.</span>
        <span className="h-px w-7 bg-border" />
      </div>
    </main>
  );
}
