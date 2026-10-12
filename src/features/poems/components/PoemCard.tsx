import { Link } from "react-router-dom";

import {
  CalendarDays,
  ExternalLink,
  Feather,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { Poem } from "@/contracts/poem";
import { PoemCoverImage } from "@/features/poems/components/PoemCoverImage";
import { recordPoemView } from "@/features/poems/poemApi";

interface PoemCardProps {
  poem: Poem;
}

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export function PoemCard({ poem }: PoemCardProps) {
  const preview = poem.content.trim();
  const author = poem.authorName?.trim() || "Unknown author";

  return (
    <Card className="h-full overflow-hidden gap-0 rounded-xl border-border/70 bg-card py-0 shadow-sm transition-shadow duration-200 hover:shadow-lg">
      {/* Post header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-border/70">
          <Feather aria-hidden="true" className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{author}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(poem.createdAt)}
          </p>
        </div>

        <button
          type="button"
          aria-label={`More options for ${poem.title}`}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
      </div>

      {/* Cover by default; poem image appears on hover */}
      <PoemCoverImage
        src={poem.coverImageUrl}
        poemImageSrc={poem.poemImageUrl}
        title={poem.title}
        onPoemImageViewed={() =>
          recordPoemView(poem.id).then(() => undefined)
        }
      />

      <CardContent className="flex flex-col gap-3 p-4">
        {/* Engagement actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Like poem"
            className="transition-transform hover:scale-110"
          >
            <Heart
              aria-hidden="true"
              className="size-6 transition-colors hover:text-rose-500"
            />
          </button>

          <button
            type="button"
            aria-label="Comment on poem"
            className="transition-transform hover:scale-110"
          >
            <MessageCircle aria-hidden="true" className="size-6" />
          </button>

          <button
            type="button"
            aria-label="Share poem"
            className="transition-transform hover:scale-110"
          >
            <Send aria-hidden="true" className="size-6" />
          </button>

          <div className="flex-1" />

          {poem.instagramPostUrl && (
            <a
              href={poem.instagramPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Instagram post"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink aria-hidden="true" className="size-5" />
            </a>
          )}
        </div>

        {/* Title and caption */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug">
            <Link
              to={`/app/poems/${encodeURIComponent(poem.id)}`}
              className="rounded-sm underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {poem.title}
            </Link>
          </h3>

          <p className="text-sm leading-6 text-muted-foreground">
            <span className="mr-2 font-semibold text-foreground">
              {author}
            </span>
            <span className="whitespace-pre-line">
              {preview || "No preview available for this poem."}
            </span>
          </p>
        </div>

        <Link
          to={`/app/poems/${encodeURIComponent(poem.id)}`}
          className="inline-flex w-fit items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Read full poem <span aria-hidden="true" className="ml-1">→</span>
        </Link>

        <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <time dateTime={poem.createdAt}>
            Posted {formatDate(poem.createdAt)}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}