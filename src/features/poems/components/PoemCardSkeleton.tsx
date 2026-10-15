import { Card, CardContent } from "@/components/ui/card";

export function PoemCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="poetry-card flex h-full min-w-0 flex-col gap-0 overflow-hidden rounded-xl border-border/80 bg-card py-0 shadow-sm"
    >
      {/* Author and date */}
      <div className="flex items-center gap-2.5 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
        </div>

        <div className="size-7 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Artwork placeholder */}
      <div className="mx-3 overflow-hidden rounded-lg border border-border/60 sm:mx-4">
        <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        {/* Collection label and poem title */}
        <div className="space-y-2">
          <div className="h-2 w-28 animate-pulse rounded bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        </div>

        {/* Engagement row */}
        <div className="flex items-center gap-4 border-y border-border/70 py-2">
          <div className="h-4 w-14 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="ml-auto h-3 w-12 animate-pulse rounded bg-muted" />
        </div>

        {/* Comment preview */}
        <div className="space-y-2">
          <div className="h-2.5 w-28 animate-pulse rounded bg-muted" />

          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-3"
            >
              <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="flex gap-1.5">
          <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
          <div className="size-9 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Read button */}
        <div className="mt-auto h-9 animate-pulse rounded-lg bg-muted" />
      </CardContent>
    </Card>
  );
}
