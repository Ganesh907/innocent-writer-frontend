import { Feather } from "lucide-react";
import { Skeleton } from "../Skeleton";

export function LoginPageSkeleton() {
  return (
    <main
      data-product="gateway"
      className="poetry-desk grid min-h-[calc(100svh-3rem)] place-items-center px-3 py-4 sm:px-5"
    >
      <div className="gateway-book w-full max-w-5xl">
        <div className="gateway-spread">
          <aside className="gateway-page gateway-page--left hidden min-w-0 flex-col justify-between gap-5 p-5 sm:p-6 md:flex lg:p-7">
            <div>
              <div className="inline-flex items-center gap-3 font-semibold tracking-tight">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10">
                  <Feather className="size-5 text-primary" />
                </span>
                <span>Innocent Writer</span>
              </div>

              <div className="mt-8 space-y-3">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-9 w-full max-w-md rounded" />
                <Skeleton className="h-9 w-3/4 rounded" />
                <div className="space-y-1 pt-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
              </div>
            </div>

            <Skeleton className="h-3 w-36 rounded" />
          </aside>

          <div className="gateway-spine hidden md:block" aria-hidden="true" />

          <section className="gateway-page gateway-page--right min-w-0 p-5 sm:p-6 lg:p-7">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-4 flex items-center gap-3 md:hidden">
                <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Feather className="size-5" />
                </span>
                <span className="font-semibold">Innocent Writer</span>
              </div>

              <div className="mb-5 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-8 w-64 rounded" />
                <div className="space-y-1 pt-1">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <Skeleton className="h-11 w-full rounded-md" />
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <Skeleton className="h-10 w-80 rounded-md" />
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                New to Innocent Writer?{" "}
                <Skeleton className="inline-block h-4 w-28 rounded align-middle" />
              </p>

              <Skeleton className="mt-4 h-4 w-28 rounded" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
