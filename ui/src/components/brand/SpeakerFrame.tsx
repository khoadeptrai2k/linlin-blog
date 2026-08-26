"use client";

import { OrganicImage, type OrganicFrame } from "@/components/brand/OrganicImage";

export function SpeakerFrame({
  src,
  alt,
  className,
  frame = "hero",
}: {
  src: string;
  alt: string;
  className?: string;
  frame?: OrganicFrame;
}) {
  return (
    <OrganicImage
      src={src}
      alt={alt}
      className={className}
      frame={frame}
      tone="portrait"
    />
  );
}
