import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PoemCard } from "@/features/poems/components/PoemCard";
import { PoemCardSkeleton } from "@/features/poems/components/PoemCardSkeleton";
import { getPoems } from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

const PAGE_SIZE = 6;

export function PoemsListPage() {
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    ...(appliedSearch ? { title: appliedSearch } : {}),
  };

  const poemsQuery = useQuery({
    queryKey: poemQueryKeys.list(queryParams),
    queryFn: ({ signal }) => getPoems(queryParams, signal),
  });

  const poems = poemsQuery.data?.data ?? [];
  const currentPage = poemsQuery.data?.pagination.page ?? page;
  const pageLimit = poemsQuery.data?.pagination.limit ?? PAGE_SIZE;
  const hasNextPage = poems.length === pageLimit;

  const handleClearSearch = () => {
    setAppliedSearch("");
    setPage(1);
  };

  return (
    <main data-product="poetry" className="poetry-library">
      {/* <header className="space-y-3">
<section className="poetry-library-heading relative overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm">
  <div className="relative flex items-center gap-3 px-3.5 py-3 sm:px-4">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
      <BookOpen aria-hidden="true" className="size-[18px]" />
    </span>

    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[10px]">
        <Sparkles aria-hidden="true" className="size-3" />
        Innocent Writer · Poetry
      </p>

      <h1 className="mt-0.5 font-serif text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
        The poetry library
      </h1>

      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        A collection of feelings, stories, and quiet thoughts. Find a poem that speaks to you.
      </p>
    </div>

    <div aria-hidden="true" className="hidden shrink-0 text-primary/40 sm:block">
      <Feather className="size-8 -rotate-12" strokeWidth={1.2} />
    </div>
  </div>
</section>

  <form
    onSubmit={handleSearch}
    className="flex items-center gap-2"
    role="search"
    aria-label="Search poems by title"
  >
    <div className="relative min-w-0 flex-1">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search by poem title…"
        aria-label="Search poem titles"
className="h-9 rounded-lg border-border/80 bg-card text-foreground pl-9 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
      />
    </div>

    <Button type="submit" className="h-9 shrink-0 gap-1.5 px-3">
      <Search aria-hidden="true" className="size-3.5" />
      <span className="hidden sm:inline">Search</span>
    </Button>

    {(appliedSearch || searchInput) && (
      <Button
        type="button"
        variant="outline"
        className="h-9 shrink-0 gap-1.5 px-2.5"
        onClick={handleClearSearch}
        aria-label="Clear poem search"
      >
        <X aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">Clear</span>
      </Button>
    )}
  </form>
</header> */}

      <section aria-labelledby="poems-heading" className="space-y-3 px-5">
        <div className="flex flex-col gap-2 border-b border-border/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {appliedSearch ? "Your search" : "Turn a page"}
            </p>

            <h2
              id="poems-heading"
              className="mt-1 font-serif text-xl font-semibold sm:text-2xl"
            >
              {appliedSearch ? "Search results" : "Latest poems"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
              {appliedSearch
                ? `Titles matching “${appliedSearch}”`
                : "Discover words shared by our writing community."}
            </p>
          </div>

          {!poemsQuery.isPending && !poemsQuery.isError && poems.length > 0 && (
            <span className="self-start rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground sm:self-auto">
              Page {currentPage}
            </span>
          )}
        </div>

        {poemsQuery.isPending ? (
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Loading poems"
            aria-busy="true"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <PoemCardSkeleton key={index} />
            ))}
          </div>
        ) : poemsQuery.isError ? (
          <Card className="rounded-xl border-border/80 bg-card">
            <CardContent className="flex flex-col items-center gap-4 px-5 py-8 text-center sm:py-12">
              <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                <RefreshCw aria-hidden="true" className="size-5" />
              </span>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-semibold">
                  The library is temporarily unavailable
                </h3>

                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  {getApiErrorMessage(poemsQuery.error)}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => void poemsQuery.refetch()}
                disabled={poemsQuery.isFetching}
              >
                <RefreshCw
                  aria-hidden="true"
                  className={`size-4 ${poemsQuery.isFetching ? "animate-spin" : ""}`}
                />
                {poemsQuery.isFetching ? "Trying again…" : "Try again"}
              </Button>
            </CardContent>
          </Card>
        ) : poems.length === 0 ? (
          <Card className="rounded-xl border-border/80 bg-card">
            <CardContent className="flex flex-col items-center gap-3 px-5 py-9 text-center sm:py-12">
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <BookOpen aria-hidden="true" className="size-5" />
              </span>

              <h3 className="font-serif text-xl font-semibold">
                {appliedSearch ? "No matching poems" : "A blank page, for now"}
              </h3>

              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {appliedSearch
                  ? "Try another title, or clear your search to browse the full collection."
                  : "There are no poems to display right now. Please check back later."}
              </p>

              {appliedSearch && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  <X aria-hidden="true" className="size-4" />
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>

            <nav
              aria-label="Poem list pagination"
              className="flex items-center justify-between gap-3 border-t border-border/70 pt-3"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || poemsQuery.isFetching}
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Previous
              </Button>

              <span
                aria-live="polite"
                className="text-xs text-muted-foreground sm:text-sm"
              >
                Page {currentPage}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNextPage || poemsQuery.isFetching}
              >
                Next
                <ChevronRight aria-hidden="true" className="size-4" />
              </Button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
