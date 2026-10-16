
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
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
import { Card, CardContent } from "@/components/ui/card";
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
import {
  getPoemLikeStatus,
  togglePoemLike,
} from "@/features/likes/likeApi";
import { getPoemById, recordPoemView } from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

const likeStatusQueryKey = (
  poemId: string,
  userId: string,
) => ["poem-like-status", poemId, userId] as const;

const likeMutationKey = (poemId: string) => ["poem-like", poemId] as const;

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
      (url.hostname === "instagram.com" ||
        url.hostname === "www.instagram.com") &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}


function ContentImage({ imageUrl }: { imageUrl?: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Poem"
      className="h-auto w-full rounded-xl object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function BookDivider({ label = "❦" }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2 py-1 text-primary/70"
    >
      <span className="h-px flex-1 bg-border" />
      <span className="font-serif text-lg">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function LoadingDetail() {
  return (
    <main
      className="mx-auto w-full max-w-6xl px-3 py-4 text-foreground sm:px-5 sm:py-6"
      aria-busy="true"
      aria-label="Loading poem"
    >
      <div className="mb-4 h-5 w-28 animate-pulse rounded bg-muted" />

      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg md:min-h-[680px] md:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]">
        <div className="animate-pulse border-b border-border bg-muted/50 p-6 md:border-b-0 md:border-r">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="mx-auto mt-12 aspect-[4/5] max-w-xs rounded-lg bg-muted" />
          <div className="mx-auto mt-6 h-8 w-3/4 rounded bg-muted" />
        </div>

        <div className="animate-pulse space-y-5 bg-card p-6 sm:p-8">
          <div className="mt-8 h-8 w-full rounded bg-muted" />
          <div className="h-8 w-5/6 rounded bg-muted" />
          <div className="mt-12 h-px w-full bg-muted" />
          <div className="mt-8 h-36 rounded-lg bg-muted" />
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

  const userId = user?.id ?? "guest";

  const [commentDraft, setCommentDraft] = useState("");
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const poemQuery = useQuery<Poem>({
    queryKey: poemQueryKeys.detail(id ?? ""),
    queryFn: () => getPoemById(id as string),
    enabled: Boolean(id),
  });

  const commentsQuery = useQuery<PoemComment[]>({
    queryKey: poemQueryKeys.comments(id ?? ""),
    queryFn: ({ signal }) => getCommentsByPoem(id as string, signal),
    enabled: Boolean(id) && poemQuery.isSuccess,
  });

  const analyticsQuery = useQuery({
    queryKey: poemQueryKeys.analytics(id ?? ""),
    queryFn: ({ signal }) => getPoemAnalytics(id as string, signal),
    enabled: Boolean(id) && poemQuery.isSuccess,
  });

  // Load the current user's like status from the backend.
  // This query is not executed for guests.
  const likeStatusQuery = useQuery({
    queryKey: likeStatusQueryKey(id ?? "", userId),
    queryFn: ({ signal }) => getPoemLikeStatus(id as string, signal),
    enabled:
      Boolean(id) &&
      poemQuery.isSuccess &&
      isAuthenticated &&
      !isInitializing,
    retry: 1,
  });

  const liked = isAuthenticated
    ? likeStatusQuery.data?.liked === true
    : false;

  useEffect(() => {
    if (!id || !poemQuery.isSuccess) return;

    void recordPoemView(id)
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: poemQueryKeys.analytics(id),
        }),
      )
      .catch(() => {
        // View tracking must not interrupt reading.
      });
  }, [id, poemQuery.isSuccess, queryClient]);

  const likeMutation = useMutation({
    mutationKey: likeMutationKey(id ?? ""),
    mutationFn: () => togglePoemLike(id as string),

    onSuccess: async (result) => {
      queryClient.setQueryData(
        likeStatusQueryKey(id ?? "", userId),
        result,
      );

      setLikeError(null);

      await queryClient.invalidateQueries({
        queryKey: poemQueryKeys.analytics(id as string),
      });
    },

    onError: (error) => {
      setLikeError(getApiErrorMessage(error));
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => addPoemComment(id as string, content),

    onMutate: async (content) => {
      const queryKey = poemQueryKeys.comments(id as string);

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

      queryClient.setQueryData<PoemComment[]>(queryKey, (currentComments) => [
        optimisticComment,
        ...(currentComments ?? []),
      ]);

      setCommentError(null);

      return { previousComments, optimisticId };
    },

    onSuccess: (createdComment, _content, context) => {
      const queryKey = poemQueryKeys.comments(id as string);

      setCommentDraft("");
      setCommentError(null);

      queryClient.setQueryData<PoemComment[]>(queryKey, (currentComments) => {
        const remainingComments = (currentComments ?? []).filter(
          (comment) =>
            comment.id !== context?.optimisticId &&
            comment.id !== createdComment.id,
        );

        return [createdComment, ...remainingComments].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
      });
    },

    onError: (error, _content, context) => {
      const queryKey = poemQueryKeys.comments(id as string);

      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(queryKey, context.previousComments);
      } else {
        queryClient.removeQueries({
          queryKey,
          exact: true,
        });
      }

      setCommentError(getApiErrorMessage(error));
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deletePoemComment(commentId),

    onMutate: async (commentId) => {
      const queryKey = poemQueryKeys.comments(id as string);

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<PoemComment[]>(queryKey);

      queryClient.setQueryData<PoemComment[]>(queryKey, (currentComments) =>
        (currentComments ?? []).filter((comment) => comment.id !== commentId),
      );

      setCommentError(null);

      return { previousComments };
    },

    onSuccess: () => {
      setCommentError(null);
    },

    onError: (error, _commentId, context) => {
      const queryKey = poemQueryKeys.comments(id as string);

      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }

      setCommentError(getApiErrorMessage(error));
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
    const status = (poemQuery.error as { status?: number }).status;

    const isNotFound =
      status === 404 ||
      getApiErrorMessage(poemQuery.error)
        .toLowerCase()
        .includes("poem not found");

    return (
      <DetailMessage
        title={isNotFound ? "Poem not found" : "We couldn’t load this poem"}
        message={
          isNotFound
            ? "This poem may have been removed or the link may be incorrect."
            : getApiErrorMessage(poemQuery.error)
        }
        onRetry={() =>
          isNotFound ? navigate("/app/poems") : void poemQuery.refetch()
        }
        retryLabel={isNotFound ? "Browse poems" : "Try again"}
        loading={poemQuery.isFetching}
      />
    );
  }

  const poem = poemQuery.data;
  const author = poem.authorName?.trim() || "Unknown author";
  const comments = commentsQuery.data ?? [];

  const instagramUrl = isValidInstagramPostUrl(poem.instagramPostUrl)
    ? poem.instagramPostUrl
    : null;

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isInitializing) return;

    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }

    const content = commentDraft.trim();

    if (!content || addCommentMutation.isPending) return;

    setCommentError(null);
    addCommentMutation.mutate(content);
  };

  const handleLike = () => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }

    // Don't toggle until the initial server status is known.
    if (likeStatusQuery.isPending || likeStatusQuery.isError) return;

    if (!likeMutation.isPending) {
      setLikeError(null);
      likeMutation.mutate();
    }
  };

  // Details must show the poem's image, not the collection cover image.
  const poemImageSrc = poem.poemImageUrl;

  const views = analyticsQuery.data?.views ?? "—";
  const likes = analyticsQuery.data?.likes ?? "—";
  const commentCount = analyticsQuery.data?.comments ?? comments.length;

  return (
    <main className="mx-auto w-full px-3 py-3 text-foreground sm:px-5 sm:py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2">
        <Link
          to="/app/poems"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to poems
        </Link>

        <span className="text-right text-[11px] text-muted-foreground">
          {views} views
          <span className="px-1.5">·</span>
          {formatDate(poem.createdAt)}
        </span>
      </div>

      <article className="relative isolate overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Decorative book spine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[60%] z-10 hidden w-5 -translate-x-1/2 bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent md:block"
        />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]">
          {/* Left page: poem image and author */}
          <section
            aria-label="Poem image and author"
            className="book-page book-page-left relative flex min-w-0 flex-col border-b border-border p-4 sm:p-6 md:border-b-0 md:border-r md:p-7"
          >
            <div className="flex items-center justify-between gap-3 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
              <span>Innocent Writer</span>
              <span>Poetry collection</span>
            </div>

            <BookDivider label="✦" />

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center py-3 text-center">
              <div className="w-full border border-border p-1.5 sm:p-2">
                <div className="border border-border/70 bg-muted/20 p-2 sm:p-3">
               <ContentImage
  key={poemImageSrc ?? "no-poem-image"}
  imageUrl={poemImageSrc}
/>
                </div>
              </div>

              <h1 className="mt-5 max-w-md break-words font-serif text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.7rem]">
                {poem.title}
              </h1>

              <div className="my-3 h-px w-16 bg-primary/50" />

              <p className="inline-flex items-center gap-1.5 font-serif text-sm text-muted-foreground sm:text-base">
                <UserRound aria-hidden="true" className="size-3.5" />
                by {author}
              </p>

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                  Original Instagram post
                </a>
              )}
            </div>

            <BookDivider label="❦" />

            <p className="pt-1 text-center text-[10px] tracking-wide text-muted-foreground">
              A page from the Innocent Writer collection
            </p>
          </section>

          {/* Right page: poem text and reader engagement */}
          <section
            aria-label="Poem text and reader engagement"
            className="book-page book-page-right flex min-w-0 flex-col p-4 sm:p-6 md:p-7 lg:p-8"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/70 pb-3 text-[10px] text-muted-foreground">
              <span className="font-medium uppercase tracking-[0.16em]">
                The poem
              </span>
              <span className="text-right">{formatDate(poem.createdAt)}</span>
            </div>

            <div className="mb-3 whitespace-pre-wrap break-words border-b border-border/70 pb-3 font-serif text-lg leading-[1.75] sm:text-xl sm:leading-[1.8] lg:text-[1.65rem] lg:leading-[1.7]">
              {poem.content}
            </div>

            {analyticsQuery.isError && (
              <p role="status" className="mt-3 text-xs text-muted-foreground">
                Engagement counts are temporarily unavailable.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border/70 pb-4 text-xs text-muted-foreground sm:gap-x-6">
              <button
                type="button"
                onClick={handleLike}
                disabled={
                  likeMutation.isPending ||
                  isInitializing ||
                  (isAuthenticated &&
                    (likeStatusQuery.isPending || likeStatusQuery.isError))
                }
                aria-label={liked ? "Unlike this poem" : "Like this poem"}
                aria-pressed={liked}
                className={`inline-flex items-center gap-1.5 transition-colors hover:text-primary ${
                  liked ? "text-primary" : ""
                }`}
              >
                <Heart
                  aria-hidden="true"
                  className={`size-5 ${liked ? "fill-current" : ""}`}
                />
                <span className="tabular-nums">{likes}</span>
                <span>likes</span>
              </button>

              <a
                href="#comments-title"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
                <span className="tabular-nums">{commentCount}</span>
                <span>comments</span>
              </a>

              <span
                className="inline-flex items-center gap-1.5"
                aria-label={`${views} views`}
              >
                <Eye aria-hidden="true" className="size-5" />
                <span className="tabular-nums">{views}</span>
                <span>views</span>
              </span>

              {likeError && (
                <p role="alert" className="basis-full text-xs text-destructive">
                  {likeError}
                </p>
              )}

              {isAuthenticated && likeStatusQuery.isError && (
                <div className="flex basis-full flex-wrap items-center gap-2 text-xs text-destructive">
                  <span role="alert">Couldn’t load your like status.</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => void likeStatusQuery.refetch()}
                    disabled={likeStatusQuery.isFetching}
                  >
                    <RefreshCw aria-hidden="true" className="size-3" />
                    Retry
                  </Button>
                </div>
              )}
            </div>

            <div className="my-4 sm:my-5">
              <BookDivider label="✧❦✧" />
            </div>

            {/* Comments */}
            <section
              id="comments-title"
              aria-labelledby="comments-heading"
              className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2
                  id="comments-heading"
                  className="font-serif text-xl font-medium sm:text-2xl"
                >
                  Comments &amp; reflection
                </h2>

                <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                  {commentCount}
                </span>
              </div>

              <form
                onSubmit={handleCommentSubmit}
                className="flex min-w-0 gap-2 md:flex-col"
              >
                <Input
                  id="poem-comment-input"
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Write a thoughtful comment…"
                  aria-label="Comment text"
                  maxLength={2000}
                  disabled={addCommentMutation.isPending || isInitializing}
                  className="h-9 min-w-0 border-border bg-background text-xs sm:text-sm"
                />

                <Button
                  type="submit"
                  size="sm"
                  className="h-9 shrink-0 gap-1.5 px-3 text-xs"
                  disabled={
                    addCommentMutation.isPending ||
                    isInitializing ||
                    (isAuthenticated && !commentDraft.trim())
                  }
                >
                  <Send aria-hidden="true" className="size-3.5" />
                  <span className="hidden sm:inline">
                    {addCommentMutation.isPending
                      ? "Posting…"
                      : "Post comment"}
                  </span>
                  <span className="sm:hidden">
                    {addCommentMutation.isPending ? "…" : "Post"}
                  </span>
                </Button>
              </form>

              {commentError && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {commentError}
                </p>
              )}

              <div className="mt-4">
                {commentsQuery.isPending ? (
                  <p
                    className="text-xs text-muted-foreground"
                    aria-busy="true"
                  >
                    Loading comments…
                  </p>
                ) : commentsQuery.isError ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>Comments could not be loaded.</span>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => void commentsQuery.refetch()}
                      disabled={commentsQuery.isFetching}
                    >
                      <RefreshCw aria-hidden="true" className="size-3" />
                      Retry
                    </Button>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border bg-background/50 px-3 py-4 text-center text-xs text-muted-foreground">
                    No comments yet. Be the first to share a thought.
                  </p>
                ) : (
                  <ul className="max-h-48 space-y-3 overflow-y-auto pr-1">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        canDelete={Boolean(user && user.id === comment.userId)}
                        deleting={
                          deleteCommentMutation.isPending &&
                          deleteCommentMutation.variables === comment.id
                        }
                        onDelete={() =>
                          deleteCommentMutation.mutate(comment.id)
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </section>
        </div>
      </article>

      {/* Sign-in prompt for guests */}
      {loginPromptOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLoginPromptOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-login-title"
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Feather aria-hidden="true" className="size-5" />
              </span>

              <h2
                id="detail-login-title"
                className="font-serif text-xl font-semibold"
              >
                Join the conversation
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to like this poem or post a comment. You can keep reading
              without an account.
            </p>

            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setLoginPromptOpen(false)}
              >
                Not now
              </Button>

              <Button
                type="button"
                className="flex-1"
                onClick={() => {
                  setLoginPromptOpen(false);
                  navigate("/login", {
                    state: { from: `/app/poems/${id}` },
                  });
                }}
              >
                Sign in
              </Button>
            </div>
          </section>
        </div>
      )}
    </main>
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
    <li className="flex gap-2.5 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground">
        <UserRound aria-hidden="true" className="size-4" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-xs font-semibold text-foreground">
            {comment.user?.name?.trim() || "Reader"}
          </p>

          <time
            dateTime={comment.createdAt}
            className="text-[10px] text-muted-foreground"
          >
            {formatDate(comment.createdAt)}
          </time>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-5 text-foreground">
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
    <main className="mx-auto max-w-xl px-4 py-10 text-foreground sm:py-14">
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-border bg-muted text-muted-foreground">
            <Feather aria-hidden="true" className="size-5" />
          </span>

          <div className="space-y-2">
            <h1 className="font-serif text-xl font-semibold">{title}</h1>
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