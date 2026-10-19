import { Skeleton } from "../Skeleton";

export function RegisterPageSkeleton() {
  return (
    <main
      aria-label="Loading registration form"
      aria-busy="true"
      className="mx-auto flex min-h-[70svh] w-full max-w-md items-center px-4 py-10"
    >
      <section className="w-full space-y-5 rounded-2xl border border-border/60 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-56" />
        </div>
        {["name", "email", "password"].map((field) => (
          <div key={field} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-11 w-full" />
        <Skeleton className="mx-auto h-4 w-48" />
      </section>
    </main>
  );
}