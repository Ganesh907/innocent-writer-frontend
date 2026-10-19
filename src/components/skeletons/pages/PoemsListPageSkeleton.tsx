import { Skeleton } from "../Skeleton";

export function PoemsListPageSkeleton() {
  return (
    <main
      aria-label="Loading poems"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 w-full sm:w-28" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <article
            key={i}
            className="space-y-4 rounded-xl border border-border/60 p-4"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </article>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </main>
  );
}