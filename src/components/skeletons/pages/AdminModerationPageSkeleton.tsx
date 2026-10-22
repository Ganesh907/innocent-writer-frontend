import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons";

function ModerationPoemSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="flex min-w-0 gap-4">
          <Skeleton className="size-20 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 max-w-full" />
            <Skeleton className="h-3 w-36 max-w-full" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3 max-w-full" />
            </div>
            <Skeleton className="mt-3 h-6 w-24 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-9 w-28 shrink-0 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function AdminModerationPageSkeleton() {
  return (
    <div
      className="space-y-6 py-4"
      aria-busy="true"
      aria-label="Loading content moderation"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-52 max-w-full" />
          <Skeleton className="mt-1 h-9 w-72 max-w-full sm:w-80" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-4/5 max-w-xl" />
          </div>
        </div>

        <Skeleton className="h-10 w-28 shrink-0 rounded-md" />
      </header>

      <div
        className="flex flex-wrap gap-2"
        aria-label="Publication filters loading"
      >
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <section className="space-y-3" aria-label="Poems loading">
        <ModerationPoemSkeleton />
        <ModerationPoemSkeleton />
        <ModerationPoemSkeleton />
        <ModerationPoemSkeleton />
        <ModerationPoemSkeleton />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
