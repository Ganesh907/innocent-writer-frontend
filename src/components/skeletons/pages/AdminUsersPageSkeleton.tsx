import { Skeleton } from "../Skeleton";

export function AdminUsersPageSkeleton() {
  return (
    <main
      aria-label="Loading admin users"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6"
    >
      <header className="space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-72" />
      </header>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="grid grid-cols-4 gap-4 border-b p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-3 border-b p-4 sm:grid-cols-4 sm:items-center"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </main>
  );
}