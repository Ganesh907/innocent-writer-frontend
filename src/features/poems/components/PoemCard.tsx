import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ExternalLink,
  Feather,
  Heart,
  MessageCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Poem } from "@/contracts/poem";
import { PoemCoverImage } from "@/features/poems/components/PoemCoverImage";

interface PoemCardProps {
  poem: Poem;
}

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function PoemCard({ poem }: PoemCardProps) {
  const navigate = useNavigate();
  const author = poem.authorName?.trim() || "Unknown author";
  const detailPath = `/app/poems/${encodeURIComponent(poem.id)}`;

  return (
    <Card className="group h-full overflow-hidden gap-0 rounded-2xl border-border/70 bg-card py-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex min-w-0 items-center gap-3 px-3 py-3 sm:px-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Feather aria-hidden="true" className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{author}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(poem.createdAt)}
          </p>
        </div>
      </div>

      <Link
        to={detailPath}
        aria-label={`Read ${poem.title} by ${author}`}
        className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <PoemCoverImage
          src={poem.coverImageUrl}
          poemImageSrc={poem.poemImageUrl}
          title={poem.title}
        />
      </Link>

      <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-4 border-b border-border/60 pb-3">
          <button
            type="button"
            aria-label={`View likes and like ${poem.title}`}
            onClick={() => navigate(detailPath)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-muted-foreground transition-colors hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart aria-hidden="true" className="size-5" />
            <span className="text-sm">Like</span>
          </button>

          <button
            type="button"
            aria-label={`View comments for ${poem.title}`}
            onClick={() => navigate(`${detailPath}#comments-heading`)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            <span className="text-sm">Comment</span>
          </button>

          <div className="flex-1" />

          {poem.instagramPostUrl && (
            <a
              href={poem.instagramPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open original Instagram post"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:text-base">
            <Link
              to={detailPath}
              className="hover:text-primary focus-visible:outline-none focus-visible:underline"
            >
              {poem.title}
            </Link>
          </h3>

          <p className="truncate text-xs text-muted-foreground">
            By {author}
          </p>
        </div>

        <Link
          to={detailPath}
          className="inline-flex min-h-9 items-center text-sm font-medium text-primary hover:underline"
        >
          Read poem <span aria-hidden="true" className="ml-1">→</span>
        </Link>

        <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
          <time dateTime={poem.createdAt}>
            {formatDate(poem.createdAt)}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}