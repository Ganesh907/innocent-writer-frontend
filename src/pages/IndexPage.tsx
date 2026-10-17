import { useNavigate } from "react-router-dom";
import { ArrowRight, Code2, Feather } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";

export function IndexPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Innocent Writer — Discover, Read & Publish Poetry"
        description="Discover poems, read creative writing, and publish your own poetry on Innocent Writer. Explore a community where writers share their words."
        path="/"
      />

      <main
        data-product="gateway"
        className="poetry-desk flex min-h-svh w-full items-center justify-center overflow-visible p-3 sm:p-6 md:p-8"
      >
        <div className="flex w-full max-w-[1440px] flex-col justify-center">
          <section
            aria-label="Choose your journey"
            className="gateway-book flex min-h-0 flex-col"
          >
            <div className="gateway-spread min-h-0">
              {/* LEFT PAGE — WRITING & PRODUCT */}
              <section
                aria-labelledby="gateway-writing-title"
                className="gateway-page gateway-page--left flex min-w-0 flex-col"
              >
                <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.18em]">
                    <Feather aria-hidden="true" className="size-4 shrink-0" />
                    Writing &amp; Product
                  </span>

                  <span className="shrink-0 rounded-full border border-current/20 px-2 py-1 text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">
                    Read · Write
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="relative mb-5 size-20 shrink-0 sm:size-24">
                    <div className="size-full overflow-hidden rounded-full border border-[var(--gateway-border)] bg-[var(--gateway-page)] shadow-md ring-4 ring-[var(--gateway-page-shade)]">
                      <img
                        src="/images/Writer.jpg"
                        alt="Innocent Writer"
                        className="block size-full rounded-full object-contain"
                      />
                    </div>
                  </div>

                  <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70 sm:text-xs">
                    A world made of words
                  </p>

                  <h1
                    id="gateway-writing-title"
                    className="gateway-heading text-center"
                  >
                    Innocent Writer<span aria-hidden="true">.</span>
                  </h1>

                  <p className="gateway-description min-h-[4.5rem] text-center">
                    A quiet corner to discover poems, publish your writing, and
                    give your thoughts a place to live.
                  </p>

                  {/* LEFT IMAGE — fixed preview slot */}
                  <div className="my-5 flex h-[180px] w-full shrink-0 items-center justify-center sm:h-[196px]">
                    <div className="h-full w-full max-w-[350px] overflow-hidden rounded-md border border-[var(--gateway-border)] shadow-md">
                      <img
                        src="/images/ProductBgTwo.png"
                        alt="Innocent Writer homepage preview"
                        className="block h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="mt-auto w-full pt-4 text-center">
                    <Button
                      type="button"
                      size="lg"
                      className="gateway-cta w-full sm:w-auto cursor-pointer"
                      onClick={() => navigate("/app")}
                    >
                      Explore Innocent Writer
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-2 size-4 shrink-0"
                      />
                    </Button>

                    <p className="mt-3 text-[10px] opacity-70 sm:text-xs">
                      Read, reflect, and share your voice.
                    </p>
                  </div>
                </div>
              </section>

              {/* BOOK SPINE */}
              <div aria-hidden="true" className="gateway-spine" />

              {/* RIGHT PAGE — DEVELOPMENT PORTFOLIO */}
              <section
                aria-labelledby="gateway-portfolio-title"
                className="gateway-page gateway-page--right flex min-w-0 flex-col"
              >
                <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.18em]">
                    <Code2 aria-hidden="true" className="size-4 shrink-0" />
                    Development
                  </span>

                  <span className="shrink-0 rounded-full border border-current/20 px-2 py-1 text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">
                    Code · Debug
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                  {/* <div className="flex flex-1 flex-col items-center justify-center"> */}
                  <div className="relative mb-5 size-20 shrink-0 sm:size-24">
                    <div className="size-full overflow-hidden rounded-full border border-[var(--gateway-border)] bg-[var(--gateway-page)] shadow-md ring-4 ring-[var(--gateway-page-shade)]">
                      <img
                        src="/images/Ganesh.jpg"
                        alt="Ganesh Shinde"
                        className="block size-full rounded-full object-contain"
                      />
                    </div>
                  </div>

                  <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70 sm:text-xs">
                    Engineering with purpose
                  </p>

                  <h2
                    id="gateway-portfolio-title"
                    className="gateway-heading text-center"
                  >
                    Ganesh Shinde<span aria-hidden="true">.</span>
                  </h2>

                  <p className="gateway-description min-h-[4.5rem] text-center">
                    Explore my full-stack projects, technical skills, and the
                    engineering behind practical applications.
                  </p>

                  {/* RIGHT IMAGE — same slot and dimensions */}
                  <div className="my-5 flex h-[180px] w-full shrink-0 items-center justify-center sm:h-[196px]">
                    <div className="h-full w-full max-w-[350px] overflow-hidden rounded-md border border-[var(--gateway-border)] shadow-md">
                      <img
                        src="/images/BgTwo.png"
                        alt="Development Portfolio homepage preview"
                        className="block h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="mt-auto w-full pt-1 text-center">
                    <Button
                      type="button"
                      size="lg"
                      className="gateway-cta gateway-cta--portfolio w-full sm:w-auto cursor-pointer"
                      onClick={() => navigate("/portfolio")}
                    >
                      View Portfolio
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-2 size-4 shrink-0"
                      />
                    </Button>

                    <p className="mt-3 text-[10px] opacity-70 sm:text-xs">
                      Explore the craft behind the code.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
