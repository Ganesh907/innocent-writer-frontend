import { useEffect, useState } from "react";
import {
  Feather,
  Images,
  X,
  ZoomIn,
} from "lucide-react";

interface PoemCoverImageProps {
  src: string | null | undefined;
  poemImageSrc?: string | null;
  title: string;
}

export function PoemCoverImage({
  src,
  poemImageSrc,
  title,
}: PoemCoverImageProps) {
  const [showPoemImage, setShowPoemImage] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

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

  useEffect(() => {
    if (!isGalleryOpen) return;

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

  const gallerySrc =
    realSrc && !isFailed(realSrc)
      ? realSrc
      : coverSrc && !isFailed(coverSrc)
        ? coverSrc
        : undefined;

  const handleImageError = (imageSrc: string) => {
    setFailedImages((previous) =>
      previous.includes(imageSrc)
        ? previous
        : [...previous, imageSrc]
    );
  };

  if (!activeSrc) {
    return (
      <div
        aria-label={`No image available for ${title}`}
        role="img"
        className="flex aspect-[3/4] w-full items-center justify-center bg-muted text-muted-foreground"
      >
        <div className="flex flex-col items-center gap-2">
          <Feather aria-hidden="true" className="size-7" />
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group relative aspect-[3/4] w-full overflow-hidden bg-muted"
        onMouseEnter={() => setShowPoemImage(true)}
        onMouseLeave={() => setShowPoemImage(false)}
      >
        <img
          src={activeSrc}
          alt={`Artwork for ${title}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => handleImageError(activeSrc)}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {gallerySrc && (
          <button
            type="button"
            aria-label={`View ${title} in gallery`}
            title="View full-size image"
            onClick={() => setIsGalleryOpen(true)}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-xl border border-white/30 bg-black/45 text-white opacity-100 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Images aria-hidden="true" className="size-5" />
          </button>
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn aria-hidden="true" className="size-3.5" />
          View artwork
        </div>
      </div>

      {isGalleryOpen && gallerySrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-size artwork: ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsGalleryOpen(false);
            }
          }}
        >
          <div className="relative flex max-h-full max-w-full flex-col items-center">
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setIsGalleryOpen(false)}
              className="absolute -right-2 -top-12 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-0"
            >
              <X aria-hidden="true" className="size-6" />
            </button>

            <img
              src={gallerySrc}
              alt={`Full-size artwork for ${title}`}
              className="max-h-[80vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
              onError={() => handleImageError(gallerySrc)}
            />

            <p className="mt-4 max-w-[92vw] text-center text-sm font-medium text-white">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}