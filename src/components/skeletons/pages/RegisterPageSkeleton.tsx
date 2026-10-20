import { Feather } from "lucide-react";
import { Skeleton } from "../Skeleton";

export function RegisterPageSkeleton() {
  return (
    <main
      data-product="gateway"
      aria-busy="true"
      aria-label="Loading registration page"
      className="poetry-desk grid min-h-[calc(100svh-3rem)] place-items-center px-3 py-3 sm:px-5 sm:py-4"
    >
      <div className="gateway-book w-full max-w-5xl">
        <div className="gateway-spread">
          {/* Left book page */}
          <aside className="gateway-page gateway-page--left hidden min-w-0 flex-col justify-between gap-5 p-5 sm:p-6 md:flex lg:p-7">
            <div>
              <div className="inline-flex items-center gap-3 font-semibold tracking-tight">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10">
                  <Feather className="size-5" aria-hidden="true" />
                </span>
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="relative z-10 mt-8 space-y-3">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-9 w-full max-w-sm lg:h-10" />
                <Skeleton className="h-9 w-4/5 max-w-sm lg:h-10" />
                <div className="max-w-sm space-y-2 pt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            <Skeleton className="h-3 w-48" />
          </aside>

          {/* Book spine */}
          <div className="gateway-spine hidden md:block" aria-hidden="true" />

          {/* Right book page */}
          <section className="gateway-page gateway-page--right min-w-0 p-5 sm:p-6 lg:p-7">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-4 flex items-center gap-3 md:hidden">
                <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Feather className="size-5" aria-hidden="true" />
                </span>
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="mb-5 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-56 sm:h-9 sm:w-64" />
                <Skeleton className="h-4 w-full max-w-sm" />
              </div>

              <div className="space-y-3.5">
                {/* Full name */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-3 w-11/12" />
                </div>

                {/* Create account button */}
                <Skeleton className="h-11 w-full rounded-md" />
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-12" />
              </div>

              <div className="mt-4">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
