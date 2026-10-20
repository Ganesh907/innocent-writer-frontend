import { Feather, Code2 } from "lucide-react";
import { Skeleton } from "../Skeleton";

export function GatewayPageSkeleton() {
  return (
    <main
      data-product="gateway"
      className="poetry-desk flex min-h-svh w-full items-center justify-center overflow-visible p-3 sm:p-6 md:p-8"
    >
      <div className="flex w-full max-w-[1440px] flex-col justify-center">
        <section
          aria-label="Choose your journey"
          aria-busy="true"
          className="gateway-book flex min-h-0 flex-col"
        >
          <div className="gateway-spread min-h-0">
            {/* LEFT PAGE — WRITING & PRODUCT */}
            <section
              aria-label="Loading writing and product"
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
                  <div className="size-full overflow-hidden rounded-full border border-[var(--gateway-border)] bg-[var(--gateway-page)] shadow-md ring-4 ring-[var(--gateway-page-shade)] flex items-center justify-center">
                    <Skeleton className="size-full rounded-full" />
                  </div>
                </div>

                <Skeleton className="mb-2 h-4 w-40 rounded" />
                <Skeleton className="mb-3 h-8 w-60 rounded" />

                <div className="min-h-[4.5rem] w-full max-w-sm space-y-1.5 text-center">
                  <Skeleton className="mx-auto h-4 w-full rounded" />
                  <Skeleton className="mx-auto h-4 w-4/5 rounded" />
                </div>

                <div className="my-5 flex h-[180px] w-full shrink-0 items-center justify-center sm:h-[196px]">
                  <div className="h-full w-full max-w-[350px] overflow-hidden rounded-md border border-[var(--gateway-border)] shadow-md">
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                </div>

                <div className="mt-auto w-full pt-4 text-center">
                  <Skeleton className="mx-auto h-11 w-64 rounded-md sm:w-56" />
                  <Skeleton className="mx-auto mt-3 h-3 w-44 rounded" />
                </div>
              </div>
            </section>

            {/* BOOK SPINE */}
            <div aria-hidden="true" className="gateway-spine" />

            {/* RIGHT PAGE — DEVELOPMENT PORTFOLIO */}
            <section
              aria-label="Loading development portfolio"
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
                <div className="relative mb-5 size-20 shrink-0 sm:size-24">
                  <div className="size-full overflow-hidden rounded-full border border-[var(--gateway-border)] bg-[var(--gateway-page)] shadow-md ring-4 ring-[var(--gateway-page-shade)] flex items-center justify-center">
                    <Skeleton className="size-full rounded-full" />
                  </div>
                </div>

                <Skeleton className="mb-2 h-4 w-40 rounded" />
                <Skeleton className="mb-3 h-8 w-44 rounded" />

                <div className="min-h-[4.5rem] w-full max-w-sm space-y-1.5 text-center">
                  <Skeleton className="mx-auto h-4 w-full rounded" />
                  <Skeleton className="mx-auto h-4 w-4/5 rounded" />
                </div>

                <div className="my-5 flex h-[180px] w-full shrink-0 items-center justify-center sm:h-[196px]">
                  <div className="h-full w-full max-w-[350px] overflow-hidden rounded-md border border-[var(--gateway-border)] shadow-md">
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                </div>

                <div className="mt-auto w-full pt-1 text-center">
                  <Skeleton className="mx-auto h-11 w-44 rounded-md sm:w-40" />
                  <Skeleton className="mx-auto mt-3 h-3 w-48 rounded" />
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}