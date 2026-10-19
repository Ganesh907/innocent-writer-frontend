import { useState } from "react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { ImageSkeleton } from "./ImageSkeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string | null | undefined;
  skeletonAspectRatio?: "square" | "portrait" | "landscape";
  wrapperClassName?: string;
  fallback?: ReactNode;
}

/** Image primitive with a shared loading skeleton and a safe broken-image fallback. */
export function ImageWithSkeleton({
  src,
  alt,
  className,
  wrapperClassName,
  skeletonAspectRatio = "landscape",
  fallback,
  onLoad,
  onError,
  ...imageProps
}: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src?.trim() || undefined;
  const isLoaded = Boolean(imageSrc && loadedSrc === imageSrc);
  const hasFailed = Boolean(imageSrc && failedSrc === imageSrc);

  if (!imageSrc || hasFailed) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className={cn(
          "flex items-center justify-center overflow-hidden bg-muted/60 text-xs text-muted-foreground",
          wrapperClassName,
          className,
        )}
      >
        {fallback ?? <span>Image unavailable</span>}
      </div>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", wrapperClassName)}>
      {!isLoaded && (
        <span className="absolute inset-0">
          <ImageSkeleton aspectRatio={skeletonAspectRatio} className="h-full" />
        </span>
      )}
      <img
        {...imageProps}
        src={imageSrc}
        alt={alt ?? ""}
        onLoad={(event) => {
          setLoadedSrc(imageSrc);
          setFailedSrc(null);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailedSrc(imageSrc);
          onError?.(event);
        }}
        className={cn("relative z-[1] transition-opacity duration-200", isLoaded ? "opacity-100" : "opacity-0", className)}
      />
    </span>
  );
}
