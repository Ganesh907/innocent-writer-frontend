import { useEffect, useRef, useState } from "react";
import { ImageWithSkeleton } from "@/components/skeletons";
import { Feather } from "lucide-react";

interface PoemCoverImageProps {
  src: string | null | undefined;
  poemImageSrc?: string | null;
  title: string;
  onPoemImageViewed?: () => Promise<void>;
}

export function PoemCoverImage({
  src,
  poemImageSrc,
  title,
  onPoemImageViewed,
}: PoemCoverImageProps) {
  const [showPoemImage, setShowPoemImage] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const viewRecordedRef = useRef(false);
  const viewRequestPendingRef = useRef(false);

  const coverSrc = src?.trim() || undefined;
  const realSrc = poemImageSrc?.trim() || undefined;

  const isFailed = (imageSrc: string | undefined) =>
    !imageSrc || failedImages.includes(imageSrc);

  const activeSrc =
    showPoemImage && realSrc && !isFailed(realSrc)
      ? realSrc
      : coverSrc && !isFailed(coverSrc)
        ? coverSrc
        : realSrc && !isFailed(realSrc)
          ? realSrc
          : undefined;

  const gallerySrc =
    realSrc && !isFailed(realSrc)
      ? realSrc
      : coverSrc && !isFailed(coverSrc)
        ? coverSrc
        : undefined;

  const handleRecordView = async () => {
    if (
      !realSrc ||
      isFailed(realSrc) ||
      !onPoemImageViewed ||
      viewRecordedRef.current ||
      viewRequestPendingRef.current
    ) {
      return;
    }

    viewRequestPendingRef.current = true;

    try {
      await onPoemImageViewed();
      viewRecordedRef.current = true;
    } catch {
      // A later interaction can retry failed view tracking.
    } finally {
      viewRequestPendingRef.current = false;
    }
  };

  useEffect(() => {
    if (!isGalleryOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen]);

  useEffect(() => {
    if (!isGalleryOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isGalleryOpen]);

  const handleImageError = (imageSrc: string) => {
    setFailedImages((previous) =>
      previous.includes(imageSrc) ? previous : [...previous, imageSrc],
    );
  };

  if (!activeSrc) {
    return (
      <div
        aria-label={`No image available for ${title}`}
        role="img"
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted/50 text-muted-foreground"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-md border border-dashed border-border/80"
        />

        <div className="relative flex flex-col items-center gap-3 px-4 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <Feather className="size-50" />
          </span>

          <span className="font-serif text-sm">A page yet unwritten</span>
          <span className="text-[10px]">No artwork available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group relative aspect-square w-full overflow-hidden bg-muted"
        onMouseEnter={() => {
          setShowPoemImage(true);
          void handleRecordView();
        }}
        onMouseLeave={() => setShowPoemImage(false)}
      >
        <ImageWithSkeleton
          src={activeSrc}
          alt={`Artwork for ${title}`}
          loading="lazy"
          decoding="async"
          wrapperClassName="absolute inset-0"
          skeletonAspectRatio="square"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          onError={() => handleImageError(activeSrc ?? "")}
          fallback={<Feather aria-hidden="true" className="size-6" />}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-md border border-white/20"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white sm:p-4">
          <div className="min-w-0">
            {/* <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/75">
              Innocent Writer
            </p>

            <p className="mt-1 line-clamp-2 font-serif text-sm font-medium leading-snug sm:text-base">
              {title}
            </p> */}
          </div>

          {/* <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/30 bg-black/25 backdrop-blur-sm">
            <ZoomIn aria-hidden="true" className="size-4" />
          </span> */}
        </div>
      </div>

      {isGalleryOpen && gallerySrc && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-size artwork: ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsGalleryOpen(false);
            }
          }}
        >
    
        </div>
      )}
    </>
  );
}
