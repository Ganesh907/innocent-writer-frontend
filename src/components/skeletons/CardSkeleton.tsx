import { Skeleton } from "./Skeleton";

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading cards"
    >
      {Array.from({ length: count }, (_, index) => (
        <article
          key={index}
          className="space-y-4 rounded-xl border border-border/60 p-4"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </article>
      ))}
    </div>
  );
}
