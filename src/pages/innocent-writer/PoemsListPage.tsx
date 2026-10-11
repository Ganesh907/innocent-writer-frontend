
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PoemCard } from "@/features/poems/components/PoemCard";
import { PoemCardSkeleton } from "@/features/poems/components/PoemCardSkeleton";
import { getPoems } from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

const PAGE_SIZE = 9;

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
    queryFn: () => getPoems(queryParams),
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
    <main className="space-y-8 py-8 sm:py-12">
      <header className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpen aria-hidden="true" className="size-6" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Innocent Writer · Library
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Poems for every feeling
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore poems, discover new voices, and find words that stay with you.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-2 sm:flex-row"
          role="search"
          aria-label="Search poems by title"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search poem titles..."
              aria-label="Search poem titles"
              className="pl-9"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            Search poems
          </Button>

          {appliedSearch && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearSearch}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          )}
        </form>
      </header>

      <section aria-labelledby="poems-heading" className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="poems-heading"
              className="text-xl font-semibold tracking-tight"
            >
              {appliedSearch ? "Search results" : "Latest poems"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {appliedSearch
                ? `Titles matching “${appliedSearch}”`
                : "A growing collection from our writing community."}
            </p>
          </div>

          {!poemsQuery.isPending &&
            !poemsQuery.isError &&
            poems.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage}
              </p>
            )}
        </div>

        {poemsQuery.isPending ? (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Loading poems"
            aria-busy="true"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <PoemCardSkeleton key={index} />
            ))}
          </div>
        ) : poemsQuery.isError ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-14">
              <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                <RefreshCw aria-hidden="true" className="size-5" />
              </span>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  We couldn’t load the poems
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
                <RefreshCw aria-hidden="true" className="size-4" />
                {poemsQuery.isFetching ? "Trying again…" : "Try again"}
              </Button>
            </CardContent>
          </Card>
        ) : poems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center sm:py-16">
              <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <BookOpen aria-hidden="true" className="size-5" />
              </span>

              <h3 className="text-lg font-semibold">
                {appliedSearch
                  ? "No matching poems"
                  : "No poems published yet"}
              </h3>

              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                {appliedSearch
                  ? "Try a different title or clear your search to browse all poems."
                  : "There are no poems to show right now. Please check back later."}
              </p>

              {appliedSearch && (
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>

            <nav
              aria-label="Poem list pagination"
              className="flex items-center justify-between gap-3 border-t border-border/70 pt-5"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                disabled={page <= 1 || poemsQuery.isFetching}
              >
                <ChevronLeft aria-hidden="true" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage}
              </span>

              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNextPage || poemsQuery.isFetching}
              >
                Next
                <ChevronRight aria-hidden="true" />
              </Button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
