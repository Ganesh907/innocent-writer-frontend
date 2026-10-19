import { Skeleton } from "../Skeleton";

export function ProductHomePageSkeleton() {
  return (
    <main
      aria-label="Loading poetry home"
      aria-busy="true"
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-center gap-8 overflow-hidden px-5 py-12 lg:flex-row lg:items-center"
    >
      <section className="flex-1 space-y-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-5 w-4/5 max-w-lg" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-40 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
      </section>

      <Skeleton className="h-[300px] w-full rounded-2xl sm:h-[420px] lg:w-[42%]" />
    </main>
  );
}