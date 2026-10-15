import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Code2, Feather, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function IndexPage() {
  const navigate = useNavigate();

  return (
    <main
      data-product="gateway"
      /* 1. Lock to exactly 100svh and hide global scrollbar */
      className="poetry-desk flex h-full  md:h-[100svh] w-full items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8"
    >
      {/* 2. Force full height on inner container to distribute vertical space */}
      <div className="flex h-full w-full max-w-[1440px] flex-col justify-center">
        <section
          aria-label="Choose your journey"
          /* 3. Make the book take up available height, with a max-height for large screens */
          className="gateway-book flex h-full max-h-[900px] flex-col"
        >
          {/* 4. Allow the spread to fill the book's height */}
          <div className="gateway-spread min-h-0 flex-1">
            {/* Left page: Poetry */}
            <section
              aria-labelledby="gateway-poetry-title"
              className="gateway-page gateway-page--left flex h-full flex-col justify-between"
            >
              <div className="mb-2 flex items-center justify-between gap-3 sm:mb-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.2em]">
                  <Feather aria-hidden="true" className="size-4 shrink-0" />
                  Poetry Platform
                </span>
                <span className="rounded-full border border-current/20 px-2 py-1 text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">
                  Read · Write
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <h1
                  id="gateway-poetry-title"
                  className="gateway-heading text-center"
                >
                  Innocent
                  <br />
                  Writer<span aria-hidden="true">.</span>
                </h1>
                <p className="gateway-description text-center">
                  A quiet corner to read poems, discover meaningful words, and
                  give your own thoughts a place to live.
                </p>

                <figure className="my-4 overflow-hidden sm:my-6">
                  <img
                    src="/images/innocent-writer-hero.png"
                    alt="An illustrated writer creating poetry in a garden filled with flowers and books"
                    className="gateway-artwork"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <figcaption className="mt-2 flex items-center justify-center gap-2 text-[10px] tracking-wide opacity-75 sm:text-xs">
                    <Sparkles aria-hidden="true" className="size-3.5" />A world
                    made of words
                  </figcaption>
                </figure>

                <div className="mt-auto pt-1 text-center">
                  <Button
                    type="button"
                    size="lg"
                    className="gateway-cta w-full sm:w-auto"
                    onClick={() => navigate("/app")}
                  >
                    Enter Poetry
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                  <p className="mt-3 text-[10px] opacity-70 sm:text-xs">
                    Read, reflect, and share your voice.
                  </p>
                </div>
              </div>
            </section>

            {/* Central spine */}
            <div aria-hidden="true" className="gateway-spine" />

            {/* Right page: Portfolio */}
            <section
              aria-labelledby="gateway-portfolio-title"
              className="gateway-page gateway-page--right flex h-full flex-col justify-between"
            >
              <div className="mb-2 flex items-center justify-between gap-3 sm:mb-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.2em]">
                  <Code2 aria-hidden="true" className="size-4 shrink-0" />
                  Engineering
                </span>
                <span className="rounded-full border border-current/20 px-2 py-1 text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">
                  Build · Create
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <h2
                  id="gateway-portfolio-title"
                  className="gateway-heading text-center"
                >
                  Software
                  <br />
                  Engineer
                  <br />
                  Portfolio
                </h2>
                <p className="gateway-description text-center">
                  Discover the projects, technical skills, and engineering
                  behind the work.
                </p>

                <div className="my-4 flex flex-1 flex-col items-center justify-center sm:my-6">
                  <div className="w-full max-w-[390px] border border-[var(--gateway-border)] p-3 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--gateway-border)] pb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75 sm:text-xs">
                        Selected work
                      </span>
                      <Code2 aria-hidden="true" className="size-4 shrink-0" />
                    </div>

                    <div className="space-y-3 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center border border-[var(--gateway-border)]">
                          <Code2 aria-hidden="true" className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            Full-stack development
                          </p>
                          <p className="mt-0.5 text-xs opacity-70">
                            Thoughtful, practical applications
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center border border-[var(--gateway-border)]">
                          <BookOpen aria-hidden="true" className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            Innocent Writer
                          </p>
                          <p className="mt-0.5 text-xs opacity-70">
                            A poetry platform built with care
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[var(--gateway-border)] pt-3 text-[10px] opacity-70 sm:text-xs">
                      Design · Engineering · Continuous learning
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-1 text-center">
                  <Button
                    type="button"
                    size="lg"
                    className="gateway-cta gateway-cta--portfolio w-full sm:w-auto"
                    onClick={() => navigate("/portfolio")}
                  >
                    View Portfolio
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                  <p className="mt-3 text-[10px] opacity-70 sm:text-xs">
                    Explore the craft behind the code.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Book footer */}
          <footer className="gateway-divider flex items-center justify-center gap-3 border-t border-[var(--gateway-border)] px-3 py-2 text-[9px] uppercase tracking-[0.16em] opacity-75 sm:px-5 sm:text-[10px] sm:tracking-[0.22em]">
            <span className="h-px flex-1 bg-[var(--gateway-border)]" />
            <span>Two journeys · One story</span>
            <span className="h-px flex-1 bg-[var(--gateway-border)]" />
          </footer>
        </section>
      </div>
    </main>
  );
}
