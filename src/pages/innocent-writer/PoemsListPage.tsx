
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Feather,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { SEO } from "@/components/shared/SEO";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PoemCard } from "@/features/poems/components/PoemCard";
import { PoemCardSkeleton } from "@/features/poems/components/PoemCardSkeleton";
import { getPoems } from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

const PAGE_SIZE = 6;

export function PoemsListPage() {
  const [searchInput, setSearchInput] = useState("");
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  };

  return (  
    <>
    <SEO
      title="Discover Poems | Innocent Writer"
      description="Discover poems, explore creative writing, and read poetry shared by writers on Innocent Writer."
      path="/app/poems"
    />
    <main data-product="poetry" className="poetry-library">
      {/* Library heading and search */}
      <header className="space-y-5">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 sm:gap-3"
          role="search"
          aria-label="Search poems by title"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by poem title..."
              aria-label="Search poem titles"
              className="h-11 rounded-full border-border/80 bg-card pl-10 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary/30 sm:h-12"
            />
          </div>

          <Button
            type="submit"
            className="h-11 shrink-0 gap-2 rounded-full px-4 shadow-sm sm:h-12 sm:px-6"
          >
            <Search aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>

          {(appliedSearch || searchInput) && (
            <Button
              type="button"
              variant="outline"
              className="size-11 shrink-0 rounded-full sm:size-12"
              onClick={handleClearSearch}
              aria-label="Clear poem search"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          )}
        </form>
      </header>

      {/* Book-style library — original design preserved */}
      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-x-3 bottom-[-7px] top-3 rounded-[1.5rem] border border-border bg-muted/70 shadow-md" />
        <div className="pointer-events-none absolute inset-x-1.5 bottom-[-4px] top-1.5 rounded-[1.5rem] border border-border bg-card shadow-md" />

        <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT BOOK PAGE */}
            <section
              aria-labelledby="poems-heading"
              className="relative min-w-0 border-b border-border px-4 py-6 sm:px-7 sm:py-8 lg:border-b-0 lg:border-r lg:px-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-5 bg-gradient-to-l from-muted/60 to-transparent lg:block"
              />

              <div className="mb-5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {appliedSearch ? "Your search" : "Turn a page"}
                  </p>

                  <h2
                    id="poems-heading"
                    className="mt-1 font-serif text-2xl font-semibold sm:text-3xl"
                  >
                    {appliedSearch ? "Search results" : "Latest poems"}
                  </h2>
                </div>

                <p className="hidden pb-1 font-serif text-xs italic text-muted-foreground sm:block">
                  Words from our writing community
                </p>
              </div>

              {poemsQuery.isPending ? (
                <div
                  className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2"
                  aria-label="Loading poems"
                  aria-busy="true"
                >
                  {Array.from({ length: 4 }, (_, index) => (
                    <PoemCardSkeleton key={index} />
                  ))}
                </div>
              ) : poemsQuery.isError ? (
                <Card className="rounded-xl border-border/80 bg-background">
                  <CardContent className="flex flex-col items-center gap-4 px-5 py-8 text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <RefreshCw aria-hidden="true" className="size-5" />
                    </span>

                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-semibold">
                        The library is temporarily unavailable
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
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
                      {poemsQuery.isFetching ? "Trying again..." : "Try again"}
                    </Button>
                  </CardContent>
                </Card>
              ) : poems.length === 0 ? (
                <Card className="rounded-xl border-border/80 bg-background">
                  <CardContent className="flex flex-col items-center gap-3 px-5 py-10 text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                      <BookOpen aria-hidden="true" className="size-5" />
                    </span>

                    <h3 className="font-serif text-xl font-semibold">
                      {appliedSearch
                        ? "No matching poems"
                        : "A blank page, for now"}
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
                /* ONLY CHANGE: 3 poem cards horizontally on the left page */
                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {poems.slice(0, 3).map((poem) => (
                    <PoemCard key={poem.id} poem={poem} />
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <span className="text-xs text-muted-foreground">
                  {currentPage > 1 && !poemsQuery.isError ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={poemsQuery.isFetching}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  ) : (
                    <span className="font-serif italic">Discover a story</span>
                  )}
                </span>

                <span className="font-serif text-xs text-muted-foreground">
                  1
                </span>
              </div>
            </section>

            {/* RIGHT BOOK PAGE */}
            <section className="relative min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-0 h-14 w-7 bg-primary"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                }}
              />

              <div className="mb-5 flex items-end justify-between gap-3 pr-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Keep exploring
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                    Keep turning
                  </h2>
                </div>

                <span className="pb-1 font-serif text-xs italic text-muted-foreground">
                  Page {currentPage}
                </span>
              </div>

              <p className="mb-4 font-serif text-sm italic text-muted-foreground sm:hidden">
                Words from our writing community
              </p>

              {poemsQuery.isPending ? (
                <div
                  className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2"
                  aria-label="Loading more poems"
                  aria-busy="true"
                >
                  {Array.from({ length: 4 }, (_, index) => (
                    <PoemCardSkeleton key={index} />
                  ))}
                </div>
              ) : poemsQuery.isError ? (
                <p className="text-sm text-muted-foreground">
                  More poems will appear when the library is available.
                </p>
              ) : poems.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-8 text-center">
                  <Feather className="mb-3 size-7 text-primary/70" />
                  <h3 className="font-serif text-lg font-semibold">
                    Keep the pages turning
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {appliedSearch
                      ? "Try a different title to discover more poems."
                      : "New stories will find their way here."}
                  </p>
                </div>
              ) : (
                /* ONLY CHANGE: 3 poem cards horizontally on the right page */
                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {poems.slice(3, 6).map((poem) => (
                    <PoemCard key={poem.id} poem={poem} />
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <span className="font-serif text-xs text-muted-foreground">
                  2
                </span>

                <Button
                  type="button"
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={
                    !hasNextPage ||
                    poemsQuery.isFetching ||
                    poemsQuery.isError
                  }
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}