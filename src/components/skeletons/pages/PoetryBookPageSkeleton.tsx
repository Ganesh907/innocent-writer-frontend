import { ArrowLeft, ArrowRight, BookOpen, Feather } from "lucide-react";
import { Skeleton } from "@/components/skeletons";

const PAPER_STYLE = {
  backgroundColor: "var(--gateway-page)",
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 27px,
      var(--gateway-page-line) 28px
    )
  `,
  backgroundRepeat: "repeat",
  backgroundSize: "100% 28px",
  backgroundClip: "padding-box",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

const COVER_STYLE = {
  backgroundColor: "#17313b",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

function CoverRuleSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full max-w-[220px] items-center gap-3 text-[var(--gateway-cover-highlight)]"
    >
      <span className="h-px flex-1 bg-current opacity-80" />
      <Skeleton className="h-5 w-5 rounded-full" />
      <span className="h-px flex-1 bg-current opacity-80" />
    </div>
  );
}

function BookCoverSkeleton({ isFront }: { isFront: boolean }) {
  return (
    <div
      className="gateway-page relative isolate box-border flex h-full w-full min-w-0 items-stretch justify-stretch overflow-hidden p-0 text-center"
      style={COVER_STYLE}
    >
      {/* Keep the cover-image slot and tint to prevent layout shift. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[4px] z-[1] rounded-[2px] border border-[#e7c99a]/35 sm:inset-[7px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12px] z-[1] border border-[#e7c99a]/80 sm:inset-[16px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] z-[1] border border-white/25 sm:inset-[23px]"
      />

      <div className="relative z-[2] flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-3 w-36 bg-white/20" />
          <CoverRuleSkeleton />
        </div>

        <div className="flex w-full flex-col items-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-[#e7c99a]/80 bg-black/20 text-white sm:mb-5 sm:size-14">
            {isFront ? (
              <BookOpen size={27} strokeWidth={1.15} aria-hidden="true" />
            ) : (
              <Feather size={26} strokeWidth={1.15} aria-hidden="true" />
            )}
          </div>
          <Skeleton className="h-10 w-4/5 max-w-[250px] bg-white/20 sm:h-12" />
          {isFront && (
            <Skeleton className="mt-2 h-10 w-5/6 max-w-[270px] bg-amber-200/30 sm:h-12" />
          )}
          <div className="my-5 flex w-full justify-center sm:my-6">
            <CoverRuleSkeleton />
          </div>
          <Skeleton className="h-4 w-4/5 max-w-[230px] bg-white/20" />
          <Skeleton className="mt-2 h-4 w-3/5 max-w-[190px] bg-white/20" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-amber-200/30" />
          <Skeleton className="h-3 w-28 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function PoetryPageSkeleton({ pageNumber }: { pageNumber: number }) {
  return (
    <div
      className={`gateway-page relative isolate box-border flex h-full w-full min-w-0 flex-col overflow-hidden p-3 text-[var(--gateway-text)] sm:p-4 ${
        pageNumber % 2 === 0 ? "gateway-page--right" : "gateway-page--left"
      }`}
      style={PAPER_STYLE}
    >
      <header className="flex min-h-[28px] w-full flex-none items-center justify-between gap-2 border-b border-[var(--gateway-border)] px-0.5 pb-2 font-serif text-[clamp(9px,1vw,12px)]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20 max-w-[60%]" />
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-1 py-2 sm:px-2 sm:py-3">
        <Skeleton className="h-full max-h-full w-full max-w-full rounded-sm" />
      </div>

      <footer className="flex min-h-[22px] w-full flex-none items-center justify-center border-t border-[var(--gateway-border)] pt-1 font-serif text-[11px] text-[var(--gateway-text-muted)]">
        <Skeleton className="h-3 w-5" />
      </footer>
    </div>
  );
}

export function PoetryBookPageSkeleton() {
  return (
    <main
      data-product="gateway"
      aria-busy="true"
      aria-label="Loading poetry book"
      className="poetry-desk flex min-h-[calc(100svh-64px)] w-full flex-col items-center overflow-x-hidden p-2 sm:p-3 md:p-4"
    >
      <section
        aria-label="Poetry book loading"
        className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center"
      >
        <div className="gateway-book flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page)] [&_.stf__wrapper]:!mx-auto [&_.stf__block]:!mx-auto [&_.stf__item]:!overflow-hidden">
            {/* Cover first, then the first poem on the right-hand page. */}
            <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-2">
              <div className="min-h-0 min-w-0 overflow-hidden">
                <BookCoverSkeleton isFront />
              </div>
              <div className="hidden min-h-0 min-w-0 overflow-hidden md:block">
                <PoetryPageSkeleton pageNumber={1} />
              </div>
            </div>

            {/* Book spine on desktop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] hidden w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--gateway-page-shade)_30%,var(--gateway-page-line)_50%,var(--gateway-page-shade)_70%,transparent)] md:block"
            />

            {/* Non-interactive controls preserve the original control footprint. */}
            <nav
              aria-label="Book page controls loading"
              className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 flex justify-between gap-2"
            >
              <div className="inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 shadow-sm md:min-h-[34px] md:px-3 md:py-2">
                <ArrowLeft size={14} aria-hidden="true" />
                <Skeleton className="h-3 w-12 bg-white/20" />
              </div>
              <div className="inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 shadow-sm md:min-h-[34px] md:px-3 md:py-2">
                <Skeleton className="h-3 w-8 bg-white/20" />
                <ArrowRight size={14} aria-hidden="true" />
              </div>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PoetryBookPageSkeleton;
