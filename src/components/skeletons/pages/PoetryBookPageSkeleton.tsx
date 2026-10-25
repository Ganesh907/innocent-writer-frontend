const WRITER_IMAGE = "/Writer.jpg";
const BOOK_COVER_IMAGE = "/BookCover.png";

function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 min-h-16 shrink-0 border-b border-border bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-3 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-zinc-900" />
          </div>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
      </div>
    </header>
  );
}

function WriterImageSkeleton() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-gray-100 dark:bg-zinc-900">
      <img
        src={WRITER_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 animate-pulse bg-black/[0.03]" />
    </div>
  );
}

function BookCoverSkeleton() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#f5f0e8]">
      <img
        src={BOOK_COVER_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 animate-pulse bg-black/[0.02]" />
    </div>
  );
}

function BookNavigationSkeleton() {
  return (
    <nav
      aria-hidden="true"
      className="pointer-events-none z-20 mt-2 flex w-full shrink-0 justify-center gap-2"
    >
      <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
      <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
      <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
    </nav>
  );
}

function BookSkeleton() {
  return (
    <div
      data-product="gateway"
      id="poetry-book-outer"
      className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden"
    >
      <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center">
        <div className="flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page,#f5f0e8)]">
            {/* Desktop: writer image on the left, book cover on the right */}
            <div className="hidden h-full min-h-0 w-full min-w-0 grid-cols-2 overflow-hidden md:grid">
              <div className="h-full min-h-0 min-w-0 overflow-hidden">
                <WriterImageSkeleton />
              </div>

              <div className="h-full min-h-0 min-w-0 overflow-hidden">
                <BookCoverSkeleton />
              </div>
            </div>

            {/* Mobile: display only the book cover */}
            <div className="h-full min-h-0 w-full overflow-hidden md:hidden">
              <BookCoverSkeleton />
            </div>

            {/* Book spine / center shadow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] hidden w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/[0.02] to-black/10 md:block" />
          </div>
        </div>
      </section>

      <BookNavigationSkeleton />
    </div>
  );
}

function FooterSkeleton() {
  return (
    <footer className="mt-auto shrink-0 border-t border-border/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-3 py-4 sm:flex-row sm:px-5 lg:px-8">
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
      </div>
    </footer>
  );
}

export function PoetryBookPageSkeleton() {
  return (
    <div
      data-product="poetry"
      className="poetry-layout flex min-h-screen flex-col bg-background text-foreground"
    >
      <NavbarSkeleton />

      <main
        id="poetry-main"
        className="mx-auto flex min-h-0 w-full flex-1 flex-col px-3 pb-0 sm:px-5 lg:px-8"
      >
        <BookSkeleton />
      </main>

      <FooterSkeleton />
    </div>
  );
}