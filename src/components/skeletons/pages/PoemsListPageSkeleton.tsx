import { Search } from "lucide-react";
import { Skeleton } from "../Skeleton";
import { PoemCardSkeleton } from "@/features/poems/components/PoemCardSkeleton";

export function PoemsListPageSkeleton() {
  return (
    <main
      data-product="poetry"
      aria-busy="true"
      aria-label="Loading poems library"
      className="poetry-library"
    >
      {/* Library heading and search */}
      <header className="space-y-5">
        <div
          role="search"
          aria-label="Search poems by title"
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Skeleton className="h-11 w-full rounded-full sm:h-12" />
          </div>
          <Skeleton className="h-11 w-[5.5rem] shrink-0 rounded-full sm:h-12 sm:w-24" />
        </div>
      </header>

      {/* Book-style library — preserve the layered book design */}
      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-x-3 bottom-[-7px] top-3 rounded-[1.5rem] border border-border bg-muted/70 shadow-md" />
        <div className="pointer-events-none absolute inset-x-1.5 bottom-[-4px] top-1.5 rounded-[1.5rem] border border-border bg-card shadow-md" />

        <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT BOOK PAGE */}
            <section
              aria-label="Latest poems loading"
              className="relative min-w-0 border-b border-border px-4 py-6 sm:px-7 sm:py-8 lg:border-b-0 lg:border-r lg:px-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-5 bg-gradient-to-l from-muted/60 to-transparent lg:block"
              />

              <div className="mb-5 flex items-end justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-1 h-8 w-44 sm:h-9 sm:w-52" />
                </div>
                <div className="hidden pb-1 sm:block">
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>

              <div
                className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Loading poem cards"
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <PoemCardSkeleton key={index} />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-3 w-4" />
              </div>
            </section>

            {/* RIGHT BOOK PAGE */}
            <section
              aria-label="More poems loading"
              className="relative min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-0 h-14 w-7 bg-primary"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                }}
              />

              <div className="mb-5 flex items-end justify-between gap-3 pr-8">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-1 h-8 w-40 sm:h-9 sm:w-48" />
                </div>
                <Skeleton className="mb-1 h-3 w-12" />
              </div>

              <p className="mb-4 sm:hidden">
                <Skeleton className="h-4 w-48" />
              </p>

              <div
                className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Loading more poem cards"
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <PoemCardSkeleton key={index} />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
