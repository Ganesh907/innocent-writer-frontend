import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  PenLine,
  Sparkles,
} from "lucide-react";

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
    ? "Start writing"
    : isAdmin
      ? "Admin workspace"
      : "My writing desk";

  return (
    <section
      aria-labelledby="poetry-home-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center overflow-hidden bg-[#f4efe5] text-[#29251f] dark:bg-background dark:text-foreground"
    >
      {/* Subtle editorial background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-[#d8c5a5]/25 blur-3xl dark:bg-primary/10" />
        <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-[#c7b59a]/20 blur-3xl dark:bg-primary/10" />

        <div className="absolute inset-0 opacity-[0.16] dark:opacity-[0.07]">
          <svg
            className="size-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="paper-grain"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="5" r=".7" fill="currentColor" />
                <circle cx="19" cy="17" r=".5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paper-grain)" />
          </svg>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-20">
        {/* Left: Editorial introduction */}
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c9b99d] bg-white/50 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#786247] dark:border-border dark:bg-card/50 dark:text-primary">
            <BookOpen className="size-3.5" />
            Innocent Writer
          </div>

          <p className="mb-4 text-sm text-[#806e58] dark:text-muted-foreground">
            A little space for everything you feel.
          </p>

          <h1
            id="poetry-home-title"
            className="max-w-lg font-serif text-4xl font-medium leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
          >
            Some things
            <br />
            are better
            <br />
            <span className="italic text-[#98674d] dark:text-primary">
              written.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#6f6558] dark:text-muted-foreground sm:text-base">
            Your late-night thoughts, unsent messages, and little pieces of
            life — give them a page of their own.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/app/poems")}
              className="h-11 gap-2 rounded-full bg-[#49392d] px-5 text-[#fff8eb] hover:bg-[#35291f] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              Explore poems
              <ArrowRight className="size-4" />
            </Button>

            {!isInitializing && !user && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => navigate("/register")}
                className="h-11 rounded-full border-[#c8b99f] bg-transparent px-5 hover:bg-[#e8dfcf] dark:border-border dark:hover:bg-accent"
              >
                Find your words
              </Button>
            )}

            {!isInitializing && user && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => navigate(writingDestination)}
                className="h-11 gap-2 rounded-full border-[#c8b99f] bg-transparent px-5 hover:bg-[#e8dfcf] dark:border-border dark:hover:bg-accent"
              >
                <PenLine className="size-4" />
                {writingAction}
              </Button>
            )}
          </div>

          <div className="mt-9 flex items-center gap-3 text-xs text-[#8b7b67] dark:text-muted-foreground">
            <span className="h-px w-9 bg-[#b7a48a] dark:bg-primary/60" />
            Read slowly. Feel deeply. Write freely.
          </div>
        </div>

        {/* Right: Open-book and paper-note composition */}
        <div className="relative mx-auto w-full max-w-[470px] lg:ml-auto">
          {/* Book shadow */}
          <div
            aria-hidden="true"
            className="absolute inset-x-5 bottom-0 top-5 rotate-3 rounded-[5px] bg-[#b6a184]/30 dark:bg-primary/15"
          />

          <article className="relative overflow-hidden rounded-[4px] border border-[#d7c9af] bg-[#fffaf0] text-[#30291f] shadow-[0_22px_65px_rgba(65,48,29,0.14)] dark:border-border dark:bg-card dark:text-card-foreground">
            {/* Book header */}
            <div className="flex items-center justify-between border-b border-[#e6dac6] px-5 py-4 dark:border-border sm:px-7">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b7355] dark:text-primary">
                <Sparkles className="size-3.5" />
                Notes from the heart
              </div>

              <span className="font-serif text-xs italic text-[#a38c6c] dark:text-muted-foreground">
                No. 01
              </span>
            </div>

            {/* Paper */}
            <div className="relative px-6 py-8 sm:px-9 sm:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-10 top-0 w-px bg-[#e6cfc2] dark:bg-primary/25"
              />

              <div className="relative pl-4 sm:pl-5">
                <p className="mb-5 font-serif text-sm italic text-[#9a8062] dark:text-primary">
                  Dear someone,
                </p>

                <h2
                  className="text-[22px] font-medium leading-[1.9] sm:text-[26px]"
                  style={{
                    fontFamily:
                      '"Noto Serif Devanagari", "Nirmala UI", serif',
                  }}
                >
                  कधी कधी वाटतं....🤔
                  <br />
                  मन तुझं वाचावं,
                  <br />
                  तुला न सांगता,
                  <br />
                  मी तुलाचं लिहावं....📝
                </h2>

                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#cbb89a] dark:bg-primary/50" />
                  <span className="text-sm text-[#a17c57] dark:text-primary">
                    ♡
                  </span>
                  <span className="h-px flex-1 bg-[#e6dac6] dark:bg-border" />
                </div>

                <div className="flex items-end justify-between dark:border-border">
                  <div>
                    <p className="font-serif text-sm italic text-[#8b7355] dark:text-primary">
                      Keep this feeling.
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#a3947e] dark:text-muted-foreground">
                      Written, not sent
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="grid size-11 -rotate-6 place-items-center rounded-full border border-[#cdb99a] text-[#947552] dark:border-border dark:text-primary"
                  >
                    <PenLine className="size-4" />
                  </div>
                </div>
              </div>

              <img
                src="/images/ProductBg.png"
                alt="Poetry and notes"
                className="block max-h-full w-full object-cover sm:max-h-72"
              />
            </div>

            {/* Book footer */}
            <div className="flex items-center justify-between bg-[#eee4d3] px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-[#84715a] dark:bg-muted dark:text-muted-foreground sm:px-7">
              <span>Little things matter</span>
              <span>♥ &nbsp; Always</span>
            </div>
          </article>

          {/* Floating page marker */}
          <div className="absolute -right-2 top-12 hidden rotate-6 rounded-sm border border-[#d7c9af] bg-[#e7d6b8] px-3 py-2 font-serif text-xs italic text-[#66513b] shadow-md dark:border-border dark:bg-card dark:text-primary sm:block">
            your story
          </div>
        </div>
      </div>
    </section>
  );
}