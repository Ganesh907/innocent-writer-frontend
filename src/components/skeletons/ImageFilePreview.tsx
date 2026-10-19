import { useEffect, useState } from "react";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

interface ImageFilePreviewProps {
  file: File | null;
  existingUrl?: string | null;
  alt: string;
  wrapperClassName: string;
  className?: string;
}

interface LocalPreview {
  file: File;
  url: string;
}

/** Shows a selected local file, otherwise the saved remote image. */
export function ImageFilePreview({
  file,
  existingUrl,
  alt,
  wrapperClassName,
  className,
}: ImageFilePreviewProps) {
  const [preview, setPreview] = useState<LocalPreview | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview({ file, url: reader.result });
      }
    };

    reader.onerror = () => {
      setPreview({ file, url: "" });
    };

    reader.readAsDataURL(file);

    return () => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  const localUrl = preview?.file === file ? preview.url : null;
  const src = localUrl || existingUrl;

  if (!src) return null;

  return (
    <ImageWithSkeleton
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      wrapperClassName={wrapperClassName}
      className={className}
    />
  );
}