
import { Skeleton } from "./Skeleton";

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

const aspectRatioClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export function ImageSkeleton({
  className,
  aspectRatio = "landscape",
}: ImageSkeletonProps) {
  return (
    <Skeleton
      className={`${aspectRatioClasses[aspectRatio]} w-full ${className ?? ""}`}
    />
  );
}
