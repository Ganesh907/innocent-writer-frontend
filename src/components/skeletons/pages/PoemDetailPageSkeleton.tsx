import {
  ArrowLeft,
  Eye,
  Feather,
  Heart,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { Skeleton } from "../Skeleton";

export function PoemDetailPageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading poem details"
      className="mx-auto w-full px-3 py-3 text-foreground sm:px-5 sm:py-5"
    >
      {/* Back navigation and poem metadata */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 shadow-sm">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <span className="text-muted-foreground">·</span>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Book-style poem detail */}
      <article className="relative isolate overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Decorative book spine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[60%] z-10 hidden w-5 -translate-x-1/2 bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent md:block"
        />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]">
          {/* Left page: poem image and author */}
          <section
            aria-label="Poem image and author loading"
            className="book-page book-page-left relative flex min-w-0 flex-col border-b border-border p-4 sm:p-6 md:border-b-0 md:border-r md:p-7"
          >
            <div className="flex items-center justify-between gap-3 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div
              aria-hidden="true"
              className="flex items-center gap-2 py-1 text-primary/70"
            >
              <span className="h-px flex-1 bg-border" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center py-3 text-center">
              <div className="w-full border border-border p-1.5 sm:p-2">
                <div className="border border-border/70 bg-muted/20 p-2 sm:p-3">
                  <Skeleton className="aspect-[3/4] min-h-48 w-full rounded-xl" />
                </div>
              </div>

              <div className="mt-5 flex w-full max-w-md flex-col items-center gap-3">
                <Skeleton className="h-9 w-4/5 sm:h-10" />
                <Skeleton className="h-px w-16" />
                <div className="inline-flex items-center justify-center gap-1.5">
                  <UserRound
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground"
                  />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="flex items-center gap-2 py-1 text-primary/70"
            >
              <span className="h-px flex-1 bg-border" />
              <Skeleton className="h-5 w-8 rounded-full" />
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex justify-center pt-1">
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
          </section>

          {/* Right page: poem text and reader engagement */}
          <section
            aria-label="Poem text and reader engagement loading"
            className="book-page book-page-right flex min-w-0 flex-col p-4 sm:p-6 md:p-7 lg:p-8"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/70 pb-3 text-[10px] text-muted-foreground">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>

            {/* Preserve poem line spacing and text area height */}
            <div className="mb-3 space-y-3 border-b border-border/70 pb-4 font-serif">
              <Skeleton className="h-6 w-full sm:h-7" />
              <Skeleton className="h-6 w-11/12 sm:h-7" />
              <Skeleton className="h-6 w-4/5 sm:h-7" />
              <Skeleton className="h-6 w-full sm:h-7" />
              <Skeleton className="h-6 w-10/12 sm:h-7" />
              <Skeleton className="h-6 w-3/4 sm:h-7" />
              <Skeleton className="mt-5 h-6 w-11/12 sm:h-7" />
              <Skeleton className="h-6 w-4/5 sm:h-7" />
              <Skeleton className="h-6 w-full sm:h-7" />
            </div>

            {/* Engagement counters */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border/70 pb-4 text-xs text-muted-foreground sm:gap-x-6">
              <div className="inline-flex items-center gap-1.5">
                <Heart aria-hidden="true" className="size-5" />
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="inline-flex items-center gap-1.5">
                <MessageCircle aria-hidden="true" className="size-5" />
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Eye aria-hidden="true" className="size-5" />
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>

            <div
              className="my-4 flex items-center gap-2 sm:my-5"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-border" />
              <Feather className="size-4 text-primary/70" />
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Comments panel */}
            <section
              aria-label="Comments loading"
              className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Skeleton className="h-7 w-48 max-w-[75%] sm:h-8" />
                <Skeleton className="h-6 w-8 rounded-full" />
              </div>

              <div className="flex min-w-0 gap-2 md:flex-col">
                <Skeleton className="h-9 min-w-0 flex-1 rounded-md" />
                <Skeleton className="h-9 w-20 shrink-0 rounded-md md:w-full" />
              </div>

              <div className="mt-4 space-y-3">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="flex gap-2.5 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                  >
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </div>
      </article>
    </main>
  );
}
