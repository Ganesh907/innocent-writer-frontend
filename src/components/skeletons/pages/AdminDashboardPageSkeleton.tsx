import { Skeleton } from "../Skeleton";

export function AdminDashboardPageSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-9 w-40 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>

        <Skeleton className="h-10 w-28 rounded-md" />
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border/60 p-5"
          >
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </section>

      <Skeleton className="h-3 w-full max-w-xl rounded" />
    </div>
  );
}