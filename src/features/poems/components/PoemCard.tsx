import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  Feather,
  Heart,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Poem } from "@/contracts/poem";
import { getPoemAnalytics } from "@/features/analytics/analyticsApi";
import {
  addPoemComment,
  getCommentsByPoem,
  type PoemComment,
} from "@/features/comments/commentApi";
import { useAuth } from "@/features/auth/authContext";
import { togglePoemLike } from "@/features/likes/likeApi";
import { PoemCoverImage } from "@/features/poems/components/PoemCoverImage";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

interface PoemCardProps {
  poem: Poem;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PoemCard({ poem }: PoemCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();

  const [commentDraft, setCommentDraft] = useState("");
  const [liked, setLiked] = useState<boolean | null>(null);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const detailPath = `/app/poems/${encodeURIComponent(poem.id)}`;
  const author = poem.authorName?.trim() || "Unknown author";

  const commentsKey = poemQueryKeys.comments(poem.id);
  const analyticsKey = poemQueryKeys.analytics(poem.id);

  const analyticsQuery = useQuery({
    queryKey: analyticsKey,
    queryFn: ({ signal }) => getPoemAnalytics(poem.id, signal),
    enabled: true,
    staleTime: 30_000,
  });

  const commentsQuery = useQuery({
    queryKey: commentsKey,
    queryFn: ({ signal }) => getCommentsByPoem(poem.id, signal),
    staleTime: 30_000,
  });

  const comments = commentsQuery.data ?? [];

  const likeMutation = useMutation({
    mutationFn: () => togglePoemLike(poem.id),

    onSuccess: async (result) => {
      setLiked(result.liked);
      setLikeError(null);

      await queryClient.invalidateQueries({
        queryKey: analyticsKey,
      });
    },

    onError: (error) => {
      setLikeError(getApiErrorMessage(error));
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => addPoemComment(poem.id, content),

    onSuccess: async (created) => {
      setCommentDraft("");
      setCommentError(null);

      queryClient.setQueryData<PoemComment[]>(commentsKey, (current) => [
        created,
        ...(current ?? []).filter((item) => item.id !== created.id),
      ]);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentsKey,
        }),
        queryClient.invalidateQueries({
          queryKey: analyticsKey,
        }),
      ]);
    },

    onError: (error) => {
      setCommentError(getApiErrorMessage(error));
    },
  });

  function requireLogin(): boolean {
    if (isInitializing) {
      return false;
    }

    if (isAuthenticated) {
      return true;
    }

    setLoginPrompt(true);
    return false;
  }

  function handleLike() {
    if (!requireLogin() || likeMutation.isPending) {
      return;
    }

    setLikeError(null);
    likeMutation.mutate();
  }

  function handleCommentsClick() {
    if (!requireLogin()) {
      return;
    }

    navigate(`${detailPath}#comments-title`);
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!requireLogin()) {
      return;
    }

    const content = commentDraft.trim();

    if (!content || commentMutation.isPending) {
      return;
    }

    setCommentError(null);
    commentMutation.mutate(content);
  }

  function handleSignIn() {
    setLoginPrompt(false);
    navigate("/login", {
      state: { from: detailPath },
    });
  }

  return (
    <>
      <Card className="poetry-card group flex h-full min-w-0 flex-col gap-0 overflow-hidden rounded-xl border border-border/80 bg-card py-0 text-card-foreground shadow-sm transition-colors hover:border-primary/30">
        {/* Author */}
        <header className="flex items-center gap-2 px-3 py-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/15 bg-primary/10 text-primary">
            <Feather aria-hidden="true" className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{author}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatDate(poem.createdAt)}
            </p>
          </div>

          {poem.instagramPostUrl && (
            <a
              href={poem.instagramPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              aria-label="Open original Instagram post"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </header>

        {/* Square artwork */}
        <Link
          to={detailPath}
          aria-label={`Read ${poem.title}`}
          className="mx-3 block overflow-hidden rounded-lg border border-border/60 bg-muted/30"
        >
          <PoemCoverImage
            src={poem.coverImageUrl}
            poemImageSrc={poem.poemImageUrl}
            title={poem.title}
          />
        </Link>

        <CardContent className="flex flex-1 flex-col gap-2 p-3">
          {/* Title */}
          <h2 className="line-clamp-2 font-serif text-base font-semibold leading-snug">
            <Link
              to={detailPath}
              className="transition-colors hover:text-primary"
            >
              {poem.title}
            </Link>
          </h2>

          {/* Likes, comments, and views */}
          <div className="flex items-center gap-3 border-y border-border/70 py-1">
            <button
              type="button"
              onClick={handleLike}
              disabled={isInitializing || likeMutation.isPending}
              aria-label={`Like ${poem.title}`}
              aria-pressed={liked === true}
              className={`inline-flex h-8 shrink-0 items-center gap-1.5 text-xs transition-colors hover:text-rose-500 ${
                liked ? "text-rose-500" : "text-muted-foreground"
              }`}
            >
              <Heart
                aria-hidden="true"
                className={`size-4 ${liked ? "fill-current" : ""}`}
              />
              <span className="tabular-nums">
                {analyticsQuery.data?.likes ?? "—"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCommentsClick}
              disabled={isInitializing}
              aria-label={`View comments on ${poem.title}`}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              <span className="tabular-nums">
                {analyticsQuery.data?.comments ?? comments.length}
              </span>
            </button>

            <span
              className="inline-flex h-8 shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
              aria-label={`${analyticsQuery.data?.views ?? poem.viewCount ?? 0} views`}
            >
              <Eye aria-hidden="true" className="size-4" />
              <span className="tabular-nums">
                {analyticsQuery.data?.views ?? poem.viewCount ?? 0}
              </span>
            </span>

            <Link
              to={`${detailPath}#comments-title`}
              className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <span>Read all comments</span>
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </Link>
          </div>

          {likeError && (
            <p role="alert" className="text-xs text-destructive">
              {likeError}
            </p>
          )}

          {/* Comments preview */}
          <section aria-label={`Comments on ${poem.title}`} className="min-w-0">
            {commentsQuery.isPending ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Loading comments…
              </p>
            ) : commentsQuery.isError ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Comments are temporarily unavailable.
              </p>
            ) : comments.length === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                No comments yet.
              </p>
            ) : (
              <div className="mt-1 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5">
                <p className="truncate text-[11px] font-medium">
                  {comments[0].user?.name?.trim() || "Reader"}
                </p>
                <p className="line-clamp-2 break-words text-xs leading-4 text-muted-foreground">
                  {comments[0].content}
                </p>
              </div>
            )}
          </section>

          {/* Comment input is available only to authenticated users */}
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="mt-0.5 space-y-1">
              <div className="flex min-w-0 gap-1.5">
                <Input
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  maxLength={2000}
                  aria-label={`Write a comment on ${poem.title}`}
                  placeholder="Share a thought…"
                  className="h-8 min-w-0 text-xs"
                  disabled={commentMutation.isPending || isInitializing}
                />

                <Button
                  type="submit"
                  size="icon"
                  aria-label="Post comment"
                  className="size-8 shrink-0"
                  disabled={
                    !commentDraft.trim() ||
                    commentMutation.isPending ||
                    isInitializing
                  }
                >
                  <Send aria-hidden="true" className="size-3.5" />
                </Button>
              </div>

              {commentMutation.isPending && (
                <p role="status" className="text-[10px] text-muted-foreground">
                  Posting comment…
                </p>
              )}

              {commentError && (
                <p role="alert" className="text-xs text-destructive">
                  {commentError}
                </p>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {/* Theme-aware sign-in dialog */}
      {loginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLoginPrompt(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`sign-in-title-${poem.id}`}
            aria-describedby={`sign-in-description-${poem.id}`}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Feather aria-hidden="true" className="size-5" />
                </span>

                <div>
                  <h2
                    id={`sign-in-title-${poem.id}`}
                    className="font-serif text-lg font-semibold"
                  >
                    Join the conversation
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Innocent Writer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLoginPrompt(false)}
                aria-label="Close sign-in dialog"
                className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <p
              id={`sign-in-description-${poem.id}`}
              className="mt-4 text-sm leading-relaxed text-muted-foreground"
            >
              Sign in to like poems and share your thoughts with the writing
              community.
            </p>

            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setLoginPrompt(false)}
              >
                Not now
              </Button>

              <Button type="button" className="flex-1" onClick={handleSignIn}>
                Sign in
                <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
