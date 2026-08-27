"use client";

import type { ReactNode } from "react";
import { OrganicImage, type OrganicFrame } from "@/components/brand/OrganicImage";
import { GlassSheet } from "@/components/ui/GlassSheet";

export type CardDrawerTile = { label: string; value: string; wide?: boolean };

export function CardDrawer({
  open,
  onClose,
  eyebrow,
  title,
  body,
  image,
  tiles,
  steps,
  stepsLabel,
  ctaLabel,
  onCta,
  persistent,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  body?: string;
  image?: {
    src: string;
    alt: string;
    frame?: OrganicFrame;
    tone?: "portrait" | "study";
  };
  tiles?: CardDrawerTile[];
  steps?: string[];
  stepsLabel?: string;
  ctaLabel?: string;
  onCta?: () => void;
  persistent?: boolean;
  children?: ReactNode;
}) {
  return (
    <GlassSheet open={open} onClose={onClose} title={eyebrow ?? title} variant="drawer" persistent={persistent}>
      {open ? (
        <div>
          {image ? (
            <OrganicImage
              src={image.src}
              alt={image.alt}
              frame={image.frame ?? "wide"}
              tone={image.tone}
              className="mt-1 aspect-[16/9] w-full"
            />
          ) : null}
          <h3 className="font-display mt-4 pr-8 text-3xl text-sky-700">{title}</h3>
          {body ? <p className="mt-3 leading-7 text-ink-soft">{body}</p> : null}
          {tiles && tiles.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {tiles.map((tile) => (
                <li
                  key={tile.label}
                  className={`control-tile min-h-0 ${tile.wide ? "col-span-2" : ""}`}
                >
                  <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                    {tile.label}
                  </span>
                  <span className="text-sm font-semibold leading-6">{tile.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {steps && steps.length > 0 ? (
            <>
              {stepsLabel ? (
                <p className="mt-5 px-1 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
                  {stepsLabel}
                </p>
              ) : null}
              <ol className="mt-2 space-y-2">
                {steps.map((step, index) => (
                  <li key={`${index}-${step}`} className="control-tile min-h-0">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-[0.7rem] font-semibold text-sky-700">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold leading-6">{step}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
          {children}
          {ctaLabel && onCta ? (
            <button type="button" className="btn-primary mt-5 w-full" onClick={onCta}>
              {ctaLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </GlassSheet>
  );
}
