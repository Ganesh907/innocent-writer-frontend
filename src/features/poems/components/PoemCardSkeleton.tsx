import { Card, CardContent } from "@/components/ui/card";

export function PoemCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="h-full overflow-hidden gap-0 rounded-xl border-border/70 py-0"
    >
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />

        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>

        <div className="size-5 animate-pulse rounded bg-muted" />
      </div>

      {/* Portrait image placeholder */}
      <div className="aspect-[3/4] w-full animate-pulse bg-muted" />

      <CardContent className="flex flex-col gap-3 p-4">
        {/* Social action placeholders */}
        <div className="flex gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="size-6 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        {/* Title and caption */}
        <div className="space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted" />
        </div>

        {/* Date */}
        <div className="border-t border-border/60 pt-3">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}