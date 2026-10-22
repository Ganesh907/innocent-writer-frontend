import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "rectangular" | "circular";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-muted",
        variant === "text" && "h-4 rounded-md",
        variant === "rectangular" && "rounded-lg",
        variant === "circular" && "rounded-full",
        className,
      )}
      {...props}
    />
  );
}
