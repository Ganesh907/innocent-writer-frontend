import { Skeleton } from "../Skeleton";

export function AdminHomePageSkeleton() {
  return (
    <main
      aria-label="Loading admin poem management"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6"
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <section className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-border/60 p-4"
            >
              <Skeleton className="size-24 shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}