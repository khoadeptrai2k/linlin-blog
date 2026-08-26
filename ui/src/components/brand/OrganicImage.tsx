"use client";

import { useState } from "react";

const frames = {
  hero: "frame-hero",
  about: "frame-about",
  peek: "frame-peek",
  wide: "frame-wide",
  pebbleA: "pebble-a",
  pebbleB: "pebble-b",
  pebbleC: "pebble-c",
  pebbleD: "pebble-d",
  plain: "frame-plain",
} as const;

export type OrganicFrame = keyof typeof frames;

export function OrganicImage({
  src,
  alt,
  className = "",
  frame = "wide",
  tone = "study",
}: {
  src: string;
  alt: string;
  className?: string;
  frame?: OrganicFrame;
  tone?: "portrait" | "study";
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`media-frame ${frames[frame]} ${className}`}>
      {failed ? (
        <div className={tone === "portrait" ? "speaker-fallback" : "study-fallback"} />
      ) : (
        // Photos live in /public/speakers or /public/learn
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
    </div>
  );
}
