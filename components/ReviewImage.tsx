"use client";

import { useState } from "react";

type ReviewImageProps = {
  src: string;
  alt: string;
};

export default function ReviewImage({
  src,
  alt,
}: ReviewImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || !src.trim() || hasError) {
    return null;
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </a>
  );
}