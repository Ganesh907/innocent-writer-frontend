import { Skeleton } from "./Skeleton";

interface PageSkeletonProps {
  label?: string;
}

export function PageSkeleton({ label = "Loading page" }: PageSkeletonProps) {
  return (
    <main
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
      aria-label={label}
      aria-busy="true"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-border/60 p-4"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </section>
    </main>
  );
}
