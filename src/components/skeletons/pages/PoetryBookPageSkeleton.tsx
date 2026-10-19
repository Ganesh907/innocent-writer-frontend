import { Skeleton } from "../Skeleton";

export function PoetryBookPageSkeleton() {
  return (
    <main
      aria-label="Loading poetry book"
      aria-busy="true"
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="mx-auto grid min-h-[55svh] w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="min-h-[420px] w-full rounded-l-xl" />
        <Skeleton className="min-h-[420px] w-full rounded-r-xl" />
      </div>

      <div className="flex justify-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </main>
  );
}