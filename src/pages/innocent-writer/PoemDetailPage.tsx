import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Eye,
  Feather,
  Heart,
  MessageCircle,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Poem } from "@/contracts/poem";
import { getPoemAnalytics } from "@/features/analytics/analyticsApi";
import {
  addPoemComment,
  deletePoemComment,
  getCommentsByPoem,
  type PoemComment,
} from "@/features/comments/commentApi";
import { useAuth } from "@/features/auth/authContext";
import { togglePoemLike } from "@/features/likes/likeApi";
import {
  getPoemById,
  recordPoemView,
} from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

// const commentQueryKey = (poemId: string) =>
//   ["poem-comments", poemId] as const;

// const analyticsQueryKey = (poemId: string) =>
//   ["poem-analytics", poemId] as const;


const likeMutationKey = (poemId: string) =>
  ["poem-like", poemId] as const;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function isValidInstagramPostUrl(
  value: string | null | undefined,
): value is string {
  if (!value?.trim()) return false;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (
        url.hostname === "instagram.com" ||
        url.hostname === "www.instagram.com"
      ) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

interface ContentImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackLabel: string;
}

function ContentImage({
  src,
  alt,
  className,
  fallbackLabel,
}: ContentImageProps) {
  const [failed, setFailed] = useState(false);
  const imageUrl = src?.trim();

  if (!imageUrl || failed) {
    return (
      <div
        role="img"
        aria-label={`${fallbackLabel}. Image unavailable.`}
        className={`flex min-h-44 items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground ${className ?? ""}`}
      >
        <span className="flex flex-col items-center gap-2">
          <Feather aria-hidden="true" className="size-6" />
          {fallbackLabel}: image unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function LoadingDetail() {
  return (
    <main
      className="space-y-6 py-8 sm:py-12"
      aria-busy="true"
      aria-label="Loading poem"
    >
      <div className="h-5 w-28 animate-pulse rounded bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />

        <div className="space-y-4 py-2">
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}

export function PoemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isInitializing } = useAuth();

  const [commentDraft, setCommentDraft] = useState("");
  const [liked, setLiked] = useState<boolean | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const poemQuery = useQuery<Poem>({
    queryKey: poemQueryKeys.detail(id ?? ""),
    queryFn: () => getPoemById(id as string),
    enabled: Boolean(id),
  });

const commentsQuery = useQuery<PoemComment[]>({
  queryKey: poemQueryKeys.comments(id ?? ""),
  queryFn: ({ signal }) =>
    getCommentsByPoem(id as string, signal),
  enabled: Boolean(id) && poemQuery.isSuccess,
});

const analyticsQuery = useQuery({
  queryKey: poemQueryKeys.analytics(id ?? ""),
  queryFn: ({ signal }) =>
    getPoemAnalytics(id as string, signal),
  enabled: Boolean(id) && poemQuery.isSuccess,
});

  /*
   * A detail page visit records a view after the poem loads.
   * Database-level deduplication handles repeated effects,
   * including React Strict Mode's development behavior.
   */
  useEffect(() => {
    if (!id || !poemQuery.isSuccess) {
      return;
    }

  void recordPoemView(id)
  .then(() =>
    queryClient.invalidateQueries({
      queryKey: poemQueryKeys.analytics(id),
    }),
  )
  .catch(() => {
    // View tracking failure must not block poem reading.
  });
  }, [id, poemQuery.isSuccess, queryClient]);

  const likeMutation = useMutation({
    mutationKey: likeMutationKey(id ?? ""),
    mutationFn: () => togglePoemLike(id as string),
    onSuccess: async (result) => {
      setLiked(result.liked);
      setActionError(null);

      await queryClient.invalidateQueries({
  queryKey: poemQueryKeys.analytics(id as string),
});
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error));
    },
  });

  const addCommentMutation = useMutation({
  mutationFn: (content: string) =>
    addPoemComment(id as string, content),

  onMutate: async (content) => {
    const queryKey = poemQueryKeys.comments(id as string);

    // Prevent an in-flight fetch from overwriting the optimistic update.
    await queryClient.cancelQueries({ queryKey });

    const previousComments =
      queryClient.getQueryData<PoemComment[]>(queryKey);

    const now = new Date().toISOString();
    const optimisticId = `optimistic-${Date.now()}`;
    const currentUserId = user?.id ?? "";

    const optimisticComment: PoemComment = {
      id: optimisticId,
      content,
      createdAt: now,
      updatedAt: now,
      userId: currentUserId,
      poemId: id as string,
      user: {
        id: currentUserId,
        name: user?.name?.trim() || "You",
      },
    };

    // Show the comment immediately, before the server responds.
    queryClient.setQueryData<PoemComment[]>(
      queryKey,
      (currentComments) => [
        optimisticComment,
        ...(currentComments ?? []),
      ],
    );

    setActionError(null);

    return {
      previousComments,
      optimisticId,
    };
  },

  onSuccess: (createdComment, _content, context) => {
    const queryKey = poemQueryKeys.comments(id as string);

    setCommentDraft("");
    setActionError(null);

    // Replace the temporary comment with the server-confirmed record.
    queryClient.setQueryData<PoemComment[]>(
      queryKey,
      (currentComments) => {
        const remainingComments = (
          currentComments ?? []
        ).filter(
          (comment) =>
            comment.id !== context?.optimisticId &&
            comment.id !== createdComment.id,
        );

        return [createdComment, ...remainingComments].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
      },
    );
  },

  onError: (error, _content, context) => {
    const queryKey = poemQueryKeys.comments(id as string);

    // Roll back the optimistic comment when the request fails.
    if (context?.previousComments !== undefined) {
      queryClient.setQueryData(
        queryKey,
        context.previousComments,
      );
    } else {
      queryClient.removeQueries({
        queryKey,
        exact: true,
      });
    }

    setActionError(getApiErrorMessage(error));
  },

  onSettled: async () => {
    // Reconcile both the comment list and engagement metrics with the server.
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.comments(id as string),
      }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.analytics(id as string),
      }),
    ]);
  },
});
  // const addCommentMutation = useMutation({
  //   mutationFn: (content: string) =>
  //     addPoemComment(id as string, content),
  //   onSuccess: async () => {
  //     setCommentDraft("");
  //     setActionError(null);

  //     await Promise.all([
  //       queryClient.invalidateQueries({
  //         queryKey: commentQueryKey(id as string),
  //       }),
  //       queryClient.invalidateQueries({
  //         queryKey: analyticsQueryKey(id as string),
  //       }),
  //     ]);
  //   },
  //   onError: (error) => {
  //     setActionError(getApiErrorMessage(error));
  //   },
  // });

  // const deleteCommentMutation = useMutation({
  //   mutationFn: (commentId: string) =>
  //     deletePoemComment(commentId),
  //   onSuccess: async () => {
  //     setActionError(null);

  //     await Promise.all([
  //       queryClient.invalidateQueries({
  //         queryKey: commentQueryKey(id as string),
  //       }),
  //       queryClient.invalidateQueries({
  //         queryKey: analyticsQueryKey(id as string),
  //       }),
  //     ]);
  //   },
  //   onError: (error) => {
  //     setActionError(getApiErrorMessage(error));
  //   },
  // });
const deleteCommentMutation = useMutation({
  mutationFn: (commentId: string) =>
    deletePoemComment(commentId),

  onMutate: async (commentId) => {
    const queryKey = poemQueryKeys.comments(id as string);

    // Cancel pending fetches before changing the cached list.
    await queryClient.cancelQueries({ queryKey });

    const previousComments =
      queryClient.getQueryData<PoemComment[]>(queryKey);

    // Remove the comment from the UI immediately.
    queryClient.setQueryData<PoemComment[]>(
      queryKey,
      (currentComments) =>
        (currentComments ?? []).filter(
          (comment) => comment.id !== commentId,
        ),
    );

    setActionError(null);

    return { previousComments };
  },

  onSuccess: () => {
    setActionError(null);
  },

  onError: (error, _commentId, context) => {
    const queryKey = poemQueryKeys.comments(id as string);

    // Restore the original list if the server rejects the deletion.
    if (context?.previousComments !== undefined) {
      queryClient.setQueryData(
        queryKey,
        context.previousComments,
      );
    }

    setActionError(getApiErrorMessage(error));
  },

  onSettled: async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.comments(id as string),
      }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.analytics(id as string),
      }),
    ]);
  },
});
  if (!id) {
    return (
      <DetailMessage
        title="Poem not found"
        message="This page does not contain a valid poem identifier."
        onRetry={() => navigate("/app/poems")}
        retryLabel="Back to poems"
      />
    );
  }

  if (poemQuery.isPending) {
    return <LoadingDetail />;
  }

  if (poemQuery.isError) {
    const status = (
      poemQuery.error as { status?: number }
    ).status;

    const isNotFound =
      status === 404 ||
      getApiErrorMessage(poemQuery.error)
        .toLowerCase()
        .includes("poem not found");

    return (
      <DetailMessage
        title={
          isNotFound
            ? "Poem not found"
            : "We couldn’t load this poem"
        }
        message={
          isNotFound
            ? "This poem may have been removed or the link may be incorrect."
            : getApiErrorMessage(poemQuery.error)
        }
        onRetry={() =>
          isNotFound
            ? navigate("/app/poems")
            : void poemQuery.refetch()
        }
        retryLabel={
          isNotFound ? "Browse poems" : "Try again"
        }
        loading={poemQuery.isFetching}
      />
    );
  }

  const poem = poemQuery.data;
  const author = poem.authorName?.trim() || "Unknown author";
  const comments = commentsQuery.data ?? [];

  const instagramUrl = isValidInstagramPostUrl(
    poem.instagramPostUrl,
  )
    ? poem.instagramPostUrl
    : null;

 const handleCommentSubmit = (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (!isAuthenticated) {
    setActionError("Please log in first to comment on this poem.");
    return;
  }

  const content = commentDraft.trim();

  if (!content || addCommentMutation.isPending) {
    return;
  }

  setActionError(null);
  addCommentMutation.mutate(content);
};

const handleLike = () => {
  if (!isAuthenticated) {
    setActionError("Please log in first to like this poem.");
    return;
  }

  if (!likeMutation.isPending) {
    setActionError(null);
    likeMutation.mutate();
  }
};

  return (
    <main className="space-y-6 py-6 sm:space-y-8 sm:py-10">
      <Link
        to="/app/poems"
        className="-ml-2 inline-flex h-9 w-fit items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to poems
      </Link>

      <article className="space-y-8">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Innocent Writer · Poem
            </p>

            <ContentImage
              src={poem.coverImageUrl}
              alt={`Cover artwork for the poem “${poem.title}”`}
              fallbackLabel="Poem cover"
              className="max-h-[560px] min-h-56 w-full rounded-2xl border border-border/60 bg-muted object-cover shadow-sm"
            />

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink
                  aria-hidden="true"
                  className="size-4"
                />
                View original Instagram post
              </a>
            )}
          </div>

          <div className="min-w-0 space-y-5">
            <div className="space-y-3">
              <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {poem.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <UserRound
                    aria-hidden="true"
                    className="size-4"
                  />
                  {author}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-4"
                  />
                  <time dateTime={poem.createdAt}>
                    {formatDate(poem.createdAt)}
                  </time>
                </span>
              </div>
            </div>

            <Card className="gap-3 rounded-2xl border-border/70 py-5 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">
                  The poem
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="whitespace-pre-wrap break-words text-base leading-8 sm:text-lg sm:leading-9">
                  {poem.content.trim() ||
                    "The author has not added poem text yet."}
                </div>
              </CardContent>
            </Card>

            {poem.poemImageUrl && (
              <section
                aria-labelledby="poem-artwork-heading"
                className="space-y-3"
              >
                <h2
                  id="poem-artwork-heading"
                  className="text-lg font-semibold"
                >
                  Poem artwork
                </h2>

                <ContentImage
                  src={poem.poemImageUrl}
                  alt={`Visual poem artwork accompanying “${poem.title}” by ${author}`}
                  fallbackLabel="Poem artwork"
                  className="max-h-[760px] min-h-48 w-full rounded-2xl border border-border/60 bg-muted object-contain"
                />
              </section>
            )}
          </div>
        </header>

        <section
          aria-label="Poem engagement"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCard
              icon={<Eye aria-hidden="true" className="size-5" />}
              label="Views"
              value={
                analyticsQuery.data?.views ?? poem.viewCount
              }
            />

            <MetricCard
              icon={
                <Heart aria-hidden="true" className="size-5" />
              }
              label="Likes"
              value={analyticsQuery.data?.likes}
            />

            <MetricCard
              icon={
                <MessageCircle
                  aria-hidden="true"
                  className="size-5"
                />
              }
              label="Comments"
              value={
                analyticsQuery.data?.comments ?? comments.length
              }
            />
          </div>

          {analyticsQuery.isError && (
            <p
              role="status"
              className="text-sm text-muted-foreground"
            >
              Engagement analytics are temporarily unavailable.{" "}
              {getApiErrorMessage(analyticsQuery.error)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleLike}
              disabled={
                likeMutation.isPending || isInitializing
              }
              variant={liked ? "secondary" : "default"}
            >
              <Heart
                aria-hidden="true"
                className={liked ? "fill-current" : ""}
              />
              {likeMutation.isPending
                ? "Saving…"
                : liked === null
                  ? "Like / unlike"
                  : liked
                    ? "Liked"
                    : "Like poem"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("poem-comment-input")
                  ?.focus()
              }
            >
              <MessageCircle aria-hidden="true" />
              Join the conversation
            </Button>

            {!isAuthenticated && !isInitializing && (
              <span className="text-sm text-muted-foreground">
                Sign in to like or comment.
              </span>
            )}
          </div>
        </section>

        <section
          aria-labelledby="comments-heading"
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2
              id="comments-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Comments
            </h2>

            <p className="text-sm text-muted-foreground">
              Thoughts and responses from readers.
            </p>
          </div>

          <Card className="rounded-2xl border-border/70 py-5 shadow-sm">
            <CardContent className="space-y-5">
              <form
                onSubmit={handleCommentSubmit}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  id="poem-comment-input"
                  value={commentDraft}
                  onChange={(event) =>
                    setCommentDraft(event.target.value)
                  }
                  placeholder={
                    isAuthenticated
                      ? "Write a thoughtful comment…"
                      : "Sign in to leave a comment"
                  }
                  aria-label="Comment text"
                  maxLength={2000}
                  disabled={
                    addCommentMutation.isPending ||
                    isInitializing
                  }
                />

                <Button
                  type="submit"
                  disabled={
                    !commentDraft.trim() ||
                    addCommentMutation.isPending ||
                    isInitializing
                  }
                  className="sm:w-auto"
                >
                  <Send aria-hidden="true" />
                  {addCommentMutation.isPending
                    ? "Posting…"
                    : "Post comment"}
                </Button>
              </form>

              {actionError && (
                <p role="alert" className="text-sm text-destructive">
                  {actionError}
                </p>
              )}

              {commentsQuery.isPending ? (
                <p
                  className="py-4 text-sm text-muted-foreground"
                  aria-busy="true"
                >
                  Loading comments…
                </p>
              ) : commentsQuery.isError ? (
                <div className="flex flex-col items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Couldn’t load comments.{" "}
                    {getApiErrorMessage(commentsQuery.error)}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void commentsQuery.refetch()
                    }
                    disabled={commentsQuery.isFetching}
                  >
                    <RefreshCw aria-hidden="true" />
                    Try again
                  </Button>
                </div>
              ) : comments.length === 0 ? (
                <p className="rounded-lg bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
                  No comments yet. Be the first to share a thought.
                </p>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      canDelete={Boolean(
                        user && user.id === comment.userId,
                      )}
                      deleting={
                        deleteCommentMutation.isPending &&
                        deleteCommentMutation.variables ===
                          comment.id
                      }
                      onDelete={() =>
                        deleteCommentMutation.mutate(comment.id)
                      }
                    />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </article>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number | undefined;
}) {
  return (
    <Card className="gap-2 rounded-xl border-border/70 py-4 shadow-none">
      <CardContent className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {value === undefined
              ? "—"
              : value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentItem({
  comment,
  canDelete,
  deleting,
  onDelete,
}: {
  comment: PoemComment;
  canDelete: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="flex gap-3 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        <UserRound aria-hidden="true" className="size-4" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold">
            {comment.user?.name?.trim() || "Reader"}
          </p>

          <time
            dateTime={comment.createdAt}
            className="text-xs text-muted-foreground"
          >
            {formatDate(comment.createdAt)}
          </time>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {comment.content}
        </p>

        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={deleting}
            className="mt-1 h-7 px-2 text-xs text-muted-foreground"
          >
            {deleting ? "Deleting…" : "Delete comment"}
          </Button>
        )}
      </div>
    </li>
  );
}

function DetailMessage({
  title,
  message,
  onRetry,
  retryLabel,
  loading = false,
}: {
  title: string;
  message: string;
  onRetry: () => void;
  retryLabel: string;
  loading?: boolean;
}) {
  return (
    <main className="py-12 sm:py-16">
      <Card className="mx-auto max-w-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Feather aria-hidden="true" className="size-5" />
          </span>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {message}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            disabled={loading}
          >
            {loading && (
              <RefreshCw
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            )}
            {retryLabel}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}