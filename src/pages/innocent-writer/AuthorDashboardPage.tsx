
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Eye,
  Feather,
  Heart,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/authContext";
import { getAuthorAnalytics } from "@/features/analytics/analyticsApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

export function AuthorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const analyticsQuery = useQuery({
    queryKey: poemQueryKeys.authorAnalytics(user?.id ?? ""),
    queryFn: ({ signal }) =>
      getAuthorAnalytics(user!.id, signal),
    enabled: Boolean(user?.id),
  });

  const analytics = analyticsQuery.data;

  return (
    <main className="space-y-8 py-8 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Feather aria-hidden="true" className="size-6" />
          </span>

          <div>
            <p className="text-sm text-muted-foreground">
              Innocent Writer · Author workspace
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Author dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Welcome, {user?.name ?? "writer"}. Track the
              performance of your writing.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/app/poems")}
        >
          <ArrowLeft aria-hidden="true" />
          Browse poems
        </Button>
      </header>

      <section aria-labelledby="analytics-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3
            aria-hidden="true"
            className="size-5 text-primary"
          />
          <h2 id="analytics-heading" className="text-xl font-semibold">
            Your performance
          </h2>
        </div>

        {analyticsQuery.isPending ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Loading analytics"
            aria-busy="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="space-y-3 p-5">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-8 w-16 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analyticsQuery.isError ? (
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p role="alert" className="text-sm text-destructive">
                Could not load analytics:{" "}
                {getApiErrorMessage(analyticsQuery.error)}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => void analyticsQuery.refetch()}
                disabled={analyticsQuery.isFetching}
              >
                <RefreshCw
                  aria-hidden="true"
                  className={analyticsQuery.isFetching ? "animate-spin" : ""}
                />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<BookOpen aria-hidden="true" />}
              label="Total poems"
              value={analytics?.poems ?? 0}
            />

            <MetricCard
              icon={<Eye aria-hidden="true" />}
              label="Lifetime views"
              value={analytics?.views ?? 0}
            />

            <MetricCard
              icon={<Heart aria-hidden="true" />}
              label="Total likes"
              value={analytics?.likes ?? 0}
            />

            <MetricCard
              icon={<MessageCircle aria-hidden="true" />}
              label="Total comments"
              value={analytics?.comments ?? 0}
            />
          </div>
        )}
      </section>

      <Card>
        <CardContent className="space-y-3 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">
            Explore the poem library
          </h2>

          <p className="text-sm leading-6 text-muted-foreground">
            Browse published poems, read other writers' work, and
            participate using the features available to your account.
            Poem publishing and management are handled through the
            admin workflow.
          </p>

          <Button
            type="button"
            onClick={() => navigate("/app/poems")}
          >
            <Feather aria-hidden="true" />
            Browse poems
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="gap-3 py-5 shadow-none">
      <CardContent className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}