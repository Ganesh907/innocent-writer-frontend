import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons";

function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-24 max-w-full" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function ImageInputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-9 w-full rounded-md" />
      <Skeleton className="h-3 w-44 max-w-full" />
    </div>
  );
}

function AdminPoemCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-5">
        <div className="flex gap-4">
          <Skeleton className="size-20 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 max-w-full" />
            <Skeleton className="h-3 w-36 max-w-full" />
            <Skeleton className="h-3 w-24 max-w-full" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12 max-w-full" />
              <Skeleton className="h-3 w-2/3 max-w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-32 max-w-full" />
      </CardContent>
    </Card>
  );
}

export function AdminHomePageSkeleton() {
  return (
    <main
      className="space-y-8 py-8 sm:py-12"
      aria-busy="true"
      aria-label="Loading admin dashboard"
    >
      <header className="space-y-3">
        <Skeleton className="h-4 w-52 max-w-full" />
        <Skeleton className="h-9 w-64 max-w-full sm:h-10 sm:w-72" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
        </div>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Analytics loading"
      >
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </section>

      <section className="space-y-4" id="poem-form-skeleton">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>

        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
 <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-52 w-full rounded-md" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ImageInputSkeleton />
              <ImageInputSkeleton />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" id="poems-skeleton">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AdminPoemCardSkeleton />
          <AdminPoemCardSkeleton />
          <AdminPoemCardSkeleton />
          <AdminPoemCardSkeleton />
        </div>

        <Skeleton className="h-3 w-full max-w-2xl" />
      </section>
    </main>
  );
}
