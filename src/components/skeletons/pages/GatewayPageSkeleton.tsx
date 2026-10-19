import { Skeleton } from "../Skeleton";

export function GatewayPageSkeleton() {
  return (
    <main
      aria-label="Loading welcome page"
      aria-busy="true"
      className="poetry-desk flex min-h-svh w-full items-center justify-center p-3 sm:p-6 md:p-8"
    >
      <div className="grid w-full max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-[1fr_auto_1fr]">
        {[0, 1].map((item) => (
          <section
            key={item}
            className="min-h-[560px] space-y-6 rounded-2xl border border-border/60 p-6 sm:p-8"
          >
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-4 pt-5">
              <Skeleton className="size-24 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-12 w-full max-w-md" />
              <Skeleton className="h-[180px] w-full max-w-[350px]" />
              <Skeleton className="h-11 w-56 rounded-lg" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}