import { BookOpen, CalendarDays, Eye, Heart, ImagePlus, MessageCircle, Plus, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons";

function ImageUploadSkeleton() {
  return (
    <div className="min-w-0 rounded-xl border border-dashed border-border bg-background/70 p-3">
      <div className="flex items-center gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <ImagePlus className="size-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="mt-3 h-20 w-full rounded-lg" />
      <Skeleton className="mt-3 h-9 w-full rounded-md" />
    </div>
  );
}

function MetricSkeleton({ icon }: { icon: React.ReactNode }) {
  return (
    <Card className="min-w-0 rounded-xl border-border bg-background py-0 shadow-none">
      <CardContent className="flex min-w-0 items-start justify-between gap-1.5 p-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="mt-1 h-6 w-9 rounded" />
        </div>
        <span className="shrink-0 text-primary [&_svg]:size-3.5">{icon}</span>
      </CardContent>
    </Card>
  );
}

function PoemItemSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border-border bg-background py-0 shadow-sm">
      <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <Skeleton className="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3 max-w-52" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3 text-muted-foreground" />
              <Skeleton className="h-3 w-20" />
            </span>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-border pt-2 sm:border-t-0 sm:pt-0">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-14 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPageSkeleton() {
  return (
    <main
      data-product="poetry"
      aria-busy="true"
      aria-label="Loading author dashboard"
      className="min-h-screen w-full bg-background px-3 py-5 text-foreground sm:px-5 sm:py-8 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Book cover and pages */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-3 bottom-[-7px] top-3 rounded-[1.5rem] border border-border bg-muted/70 shadow-md" />
          <div className="pointer-events-none absolute inset-x-1.5 bottom-[-4px] top-1.5 rounded-[1.5rem] border border-border bg-card shadow-md" />

          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT PAGE — POEM EDITOR */}
              <section
                aria-label="Poem editor loading"
                className="relative min-w-0 border-b border-border px-5 py-7 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-8"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-5 bg-gradient-to-l from-muted/60 to-transparent lg:block" />

                <header className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Plus className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-8 w-48 max-w-full sm:h-9 sm:w-56" />
                    <Skeleton className="h-4 w-40 max-w-full" />
                  </div>
                </header>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="min-h-48 w-full rounded-xl" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ImageUploadSkeleton />
                    <ImageUploadSkeleton />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                    <Skeleton className="h-10 w-36 rounded-full" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between font-serif text-xs text-muted-foreground/70">
                  <span>1</span>
                  <span className="italic">Write from the heart</span>
                </div>
              </section>

              {/* RIGHT PAGE — WELCOME, ANALYTICS AND POEMS */}
              <section className="relative min-w-0 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-8 top-0 h-16 w-7 bg-primary"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
                />

                <header className="mb-6 pr-8">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="mt-2 h-9 w-4/5 max-w-sm sm:h-10" />
                  <div className="mt-3 max-w-lg space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-5/6" />
                  </div>
                </header>

                {/* Compact analytics */}
                <div className="mb-7">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <MetricSkeleton icon={<BookOpen />} />
                    <MetricSkeleton icon={<Eye />} />
                    <MetricSkeleton icon={<Heart />} />
                    <MetricSkeleton icon={<MessageCircle />} />
                  </div>
                </div>

                {/* Poem collection */}
                <section aria-label="Poem collection loading" className="min-w-0">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="grid gap-3">
                    <PoemItemSkeleton />
                    <PoemItemSkeleton />
                    <PoemItemSkeleton />
                  </div>
                </section>

                <div className="mt-8 flex items-center justify-between font-serif text-xs text-muted-foreground/70">
                  <span className="italic">Every poem tells a story</span>
                  <span>2</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
