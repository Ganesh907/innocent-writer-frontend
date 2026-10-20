import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Database,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers3,
  MapPin,
  Server,
  Menu,
} from "lucide-react";
import { Skeleton } from "../Skeleton";

function SectionHeadingSkeleton() {
  return (
    <div className="portfolio-section-heading mb-7 max-w-3xl sm:mb-9">
      <Skeleton className="mb-3 h-4 w-32 rounded" />
      <Skeleton className="h-9 w-full max-w-2xl rounded sm:h-10 lg:h-12" />
      <div className="mt-3 max-w-2xl space-y-2 sm:mt-4">
        <Skeleton className="h-4 w-full rounded sm:h-5" />
        <Skeleton className="h-4 w-11/12 rounded sm:h-5" />
      </div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <article className="portfolio-card flex h-full min-w-0 flex-col rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary">
          <Code2 aria-hidden="true" className="size-5" />
        </div>
        <Skeleton className="h-6 w-24 max-w-[65%] rounded-full" />
      </div>

      <Skeleton className="h-6 w-3/4 max-w-64 rounded sm:h-7" />

      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>

      <div className="mt-5">
        <Skeleton className="mb-3 h-4 w-24 rounded" />
        <ul className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 flex size-4 shrink-0 items-center justify-center">
                <span className="size-3 rounded-full bg-primary/20" />
              </span>
              <Skeleton className="h-4 flex-1 rounded" />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-16 rounded-md" />
        ))}
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>
    </article>
  );
}

function ContactItemSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-primary/[0.03] p-3.5 sm:gap-4 sm:p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
        <ExternalLink aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-4 w-44 max-w-full rounded" />
      </span>
      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-primary dark:text-primary" />
    </div>
  );
}

export function PortfolioHomePageSkeleton() {
  return (
    <main
      id="portfolio-root"
      aria-label="Loading portfolio"
      aria-busy="true"
      className="portfolio-page min-h-screen overflow-x-clip bg-background text-foreground"
    >
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-card dark:bg-slate-950/55 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10">
          <div className="shrink-0 text-base font-extrabold tracking-tight sm:text-xl">
            <Skeleton className="h-5 w-36 rounded sm:h-6 sm:w-44" />
          </div>

          <nav aria-label="Main navigation" className="hidden items-center gap-4 lg:flex xl:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-14 rounded" />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="hidden h-9 w-36 rounded-md sm:block" />
            <div className="flex size-9 items-center justify-center rounded-md border border-white/25 bg-slate-900/80 text-white lg:hidden">
              <Menu aria-hidden="true" className="size-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative flex min-h-[100svh] overflow-hidden bg-cover bg-center pt-20 dark:bg-slate-950 sm:items-end md:items-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center sm:hidden"
          style={{ backgroundImage: "url('/images/PortfolioHero.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-top sm:block"
          style={{ backgroundImage: "url('/images/BgTwo.png')" }}
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,8,14,0.30), rgba(2,8,14,0.05)), linear-gradient(0deg, rgba(2,8,14,0.40), rgba(2,8,14,0.02))",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end gap-3 px-4 py-4 sm:gap-8 sm:px-6 sm:py-12 md:px-8 lg:min-h-[calc(100svh-5rem)] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-10 xl:gap-12">
          {/* Left introduction */}
          <div className="relative w-full max-w-[540px] space-y-3 rounded-2xl border-2 border-white p-3 text-white shadow-[0_0_30px_rgba(0,184,219,0.12)] backdrop-blur-md transition-colors duration-300 dark:border-primary sm:space-y-4 sm:p-7">
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-6 w-4/5 max-w-80 rounded bg-white/20" />
              <Skeleton className="h-5 w-full max-w-[460px] rounded bg-white/20 sm:h-7" />
              <Skeleton className="h-5 w-11/12 max-w-[440px] rounded bg-white/20 sm:h-7" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1 sm:gap-3">
              <Skeleton className="h-9 w-32 rounded-md bg-white/20" />
              <Skeleton className="h-9 w-32 rounded-md bg-white/20" />
            </div>
          </div>

          {/* Right profile summary */}
          <aside className="portfolio-profile-enter w-full max-w-[420px] justify-self-start lg:justify-self-end">
            <div className="rounded-3xl border border-primary/25 bg-card p-3 text-card-foreground shadow-2xl sm:p-7 md:bg-card/95">
              <div className="mb-3 flex items-center gap-3 sm:mb-5 sm:gap-4">
                <div className="size-12 shrink-0 overflow-hidden rounded-full sm:size-14">
                  <Skeleton className="size-full rounded-full" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-36 max-w-full rounded sm:h-6" />
                  <Skeleton className="h-4 w-28 max-w-full rounded" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: "Experience", Icon: BriefcaseBusiness },
                  { label: "Location", Icon: MapPin },
                  { label: "Core focus", Icon: Code2 },
                ].map(({ label, Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{label}</p>
                      <div className="mt-2 space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-4/5 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-border pt-3 sm:mt-5 sm:pt-4">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="mt-2 h-4 w-32 rounded sm:mt-3" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="portfolio-section scroll-mt-20 border-t border-primary/10 bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeadingSkeleton />

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-7">
            <div className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 shadow-sm sm:p-7">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded sm:h-5" />
                <Skeleton className="h-4 w-full rounded sm:h-5" />
                <Skeleton className="h-4 w-11/12 rounded sm:h-5" />
                <Skeleton className="h-4 w-full rounded sm:h-5" />
                <Skeleton className="h-4 w-4/5 rounded sm:h-5" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full rounded sm:h-5" />
                <Skeleton className="h-4 w-11/12 rounded sm:h-5" />
                <Skeleton className="h-4 w-5/6 rounded sm:h-5" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Skeleton className="h-10 w-36 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { title: "Frontend development", Icon: Code2 },
                { title: "Backend integration", Icon: Server },
              ].map(({ title, Icon }) => (
                <article
                  key={title}
                  className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-11/12 rounded" />
                    <Skeleton className="h-4 w-4/5 rounded" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="portfolio-section scroll-mt-20 border-y border-primary/10 bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeadingSkeleton />

          <div className="mb-6 flex flex-wrap gap-2" aria-label="Loading skill categories">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-20 rounded-md" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <article
                key={index}
                className="portfolio-reveal portfolio-card flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-card p-3.5 sm:p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                  {[Database, Server, Layers3, Code2][index % 4] === Database ? (
                    <Database aria-hidden="true" className="size-5" />
                  ) : [Database, Server, Layers3, Code2][index % 4] === Server ? (
                    <Server aria-hidden="true" className="size-5" />
                  ) : [Database, Server, Layers3, Code2][index % 4] === Layers3 ? (
                    <Layers3 aria-hidden="true" className="size-5" />
                  ) : (
                    <Code2 aria-hidden="true" className="size-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded sm:h-5" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Skeleton className="mx-auto h-10 w-40 rounded-md" />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="portfolio-section scroll-mt-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeadingSkeleton />
          <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="portfolio-reveal min-w-0">
                <ProjectCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience and education */}
      <section
        id="experience"
        className="portfolio-section scroll-mt-20 border-y border-primary/10 bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeadingSkeleton />

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-foreground">
                <BriefcaseBusiness aria-hidden="true" className="size-5 text-primary dark:text-primary" />
                Work experience
              </h3>

              <div className="relative space-y-4 border-l border-[var(--color-border-strong)]/25 pl-5 sm:pl-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <article
                    key={index}
                    className="portfolio-reveal portfolio-card relative rounded-xl border border-[var(--color-border-strong)]/15 bg-card p-4 sm:p-5"
                  >
                    <span className="absolute -left-[1.65rem] top-6 size-3 rounded-full border-2 border-[var(--color-border-strong)] bg-background dark:border-primary sm:-left-[1.95rem]" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="mt-2 h-5 w-3/4 rounded sm:h-6" />
                    <Skeleton className="mt-2 h-4 w-2/5 rounded" />
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-11/12 rounded" />
                      <Skeleton className="h-4 w-4/5 rounded" />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-foreground">
                <GraduationCap aria-hidden="true" className="size-5 text-primary dark:text-primary" />
                Education
              </h3>

              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <article
                    key={index}
                    className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/15 bg-card p-4 sm:p-5"
                  >
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="mt-2 h-6 w-4/5 rounded" />
                    <Skeleton className="mt-2 h-4 w-3/5 rounded" />
                    <Skeleton className="mt-3 h-6 w-24 rounded-md" />
                  </article>
                ))}
              </div>

              <div className="portfolio-reveal portfolio-card mt-4 rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5">
                <Skeleton className="h-5 w-24 rounded" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <FileText aria-hidden="true" className="size-4 text-primary" />
                  <Skeleton className="h-4 w-32 rounded" />
                  <ArrowDown aria-hidden="true" className="size-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="portfolio-section scroll-mt-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="portfolio-reveal overflow-hidden rounded-3xl border border-[var(--color-border-strong)]/25 bg-card shadow-[0_12px_45px_rgba(0,184,219,0.06)]">
            <div className="grid gap-7 p-5 sm:gap-9 sm:p-8 md:p-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:p-12">
              <div className="min-w-0">
                <Skeleton className="mb-3 h-4 w-24 rounded" />
                <Skeleton className="h-9 w-full max-w-md rounded sm:h-10" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full rounded sm:h-5" />
                  <Skeleton className="h-4 w-11/12 rounded sm:h-5" />
                  <Skeleton className="h-4 w-4/5 rounded sm:h-5" />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Skeleton className="h-11 w-32 rounded-md" />
                  <Skeleton className="h-11 w-28 rounded-md" />
                </div>
              </div>

              <div className="min-w-0 space-y-3">
                <ContactItemSkeleton />
                <ContactItemSkeleton />
                <ContactItemSkeleton />
                <ContactItemSkeleton />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-strong)]/15 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-64 max-w-full rounded" />
          <div className="inline-flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded" />
            <ArrowUp aria-hidden="true" className="size-4" />
          </div>
        </div>
      </footer>
    </main>
  );
}

export default PortfolioHomePageSkeleton;
