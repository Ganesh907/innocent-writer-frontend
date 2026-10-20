import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons";

function AdminUserCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-48 max-w-full" />
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="mt-2 h-3 w-40 max-w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminUsersPageSkeleton() {
  return (
    <div
      className="space-y-6 py-4"
      aria-busy="true"
      aria-label="Loading users"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-52 max-w-full" />
          <Skeleton className="mt-1 h-9 w-44 max-w-full" />
          <Skeleton className="mt-2 h-4 w-full max-w-md" />
        </div>

        <Skeleton className="h-10 w-28 shrink-0 rounded-md" />
      </header>

      <section className="space-y-3" aria-label="Users loading">
        <AdminUserCardSkeleton />
        <AdminUserCardSkeleton />
        <AdminUserCardSkeleton />
        <AdminUserCardSkeleton />
        <AdminUserCardSkeleton />
        <AdminUserCardSkeleton />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-36 max-w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
