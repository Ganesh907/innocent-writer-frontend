import { Skeleton } from "../Skeleton";

export function PoemDetailPageSkeleton() {
  return (
    <main
      aria-label="Loading poem details"
      aria-busy="true"
      className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6"
    >
      <Skeleton className="h-9 w-32" />

      <header className="space-y-3">
        <Skeleton className="h-10 w-3/4 max-w-2xl" />
        <Skeleton className="h-4 w-48" />
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Skeleton className="aspect-[3/4] w-full max-w-md justify-self-center rounded-xl" />

        <section className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-5 w-2/5" />
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${
                i % 3 === 0 ? "w-4/5" : i % 3 === 1 ? "w-full" : "w-3/5"
              }`}
            />
          ))}
          <div className="flex gap-3 pt-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-28" />
      </section>
    </main>
  );
}