import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Users,
  CheckCircle2,
  EyeOff,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminQueryKeys } from "@/features/admin/adminQueryKeys";
import { getAdminAnalytics } from "@/features/admin/adminApi";
import { getApiErrorMessage } from "@/lib/api/apiError";

export function AdminDashboardPage() {
  const analyticsQuery = useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: ({ signal }) => getAdminAnalytics(signal),
  });

  const analytics = analyticsQuery.data;

  const metrics = [
    {
      label: "Total users",
      value: analytics?.totalUsers,
      icon: <Users />,
    },
    {
      label: "Total poems",
      value: analytics?.totalPoems,
      icon: <BookOpen />,
    },
    {
      label: "Published poems",
      value: analytics?.publishedPoems,
      icon: <CheckCircle2 />,
    },
    {
      label: "Unpublished poems",
      value: analytics?.unpublishedPoems,
      icon: <EyeOff />,
    },
    {
      label: "Lifetime views",
      value: analytics?.totalViews,
      icon: <Eye />,
    },
    {
      label: "Total likes",
      value: analytics?.totalLikes,
      icon: <Heart />,
    },
    {
      label: "Total comments",
      value: analytics?.totalComments,
      icon: <MessageCircle />,
    },
  ];

  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Innocent Writer · Administration
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Platform-wide usage and content overview.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void analyticsQuery.refetch()}
          disabled={analyticsQuery.isFetching}
        >
          <RefreshCw
            className={
              analyticsQuery.isFetching ? "animate-spin" : ""
            }
          />
          Refresh
        </Button>
      </header>

      {analyticsQuery.isPending ? (
        <p className="text-sm text-muted-foreground">
          Loading platform analytics...
        </p>
      ) : analyticsQuery.isError ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <p role="alert" className="text-sm text-destructive">
              Could not load analytics:{" "}
              {getApiErrorMessage(analyticsQuery.error)}
            </p>
            <Button
              variant="outline"
              onClick={() => void analyticsQuery.refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  {metric.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {(metric.value ?? 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        Views represent the lifetime view counts recorded by the platform.
        Analytics reflect the backend response and are not calculated from
        the currently displayed poem list.
      </p>
    </div>
  );
}