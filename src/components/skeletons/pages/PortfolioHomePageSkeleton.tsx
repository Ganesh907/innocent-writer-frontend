import { Skeleton } from "../Skeleton";

export function PortfolioHomePageSkeleton() {
  return (
    <main
      aria-label="Loading portfolio"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-16 px-4 py-10 sm:px-6"
    >
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-6 w-4/5 max-w-lg" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
        <Skeleton className="h-[320px] w-full rounded-2xl sm:h-[420px]" />
      </section>

      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <article
              key={i}
              className="space-y-4 rounded-xl border border-border/60 p-5"
            >
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </main>
  );
}