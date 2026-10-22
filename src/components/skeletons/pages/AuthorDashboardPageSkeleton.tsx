import { Skeleton } from "../Skeleton";

export function AuthorDashboardPageSkeleton() {
  return (
    <main
      aria-label="Loading author dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6"
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-11 w-36 rounded-lg" />
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <section
            key={i}
            className="space-y-3 rounded-xl border border-border/60 p-4"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </section>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
        <section className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-7 w-48" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-11 w-32" />
        </section>

        <section className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-7 w-40" />
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-20 shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
