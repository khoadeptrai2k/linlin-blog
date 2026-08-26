"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SpeakerFrame } from "@/components/brand/SpeakerFrame";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const facts = [
  { id: "fact1", shape: "pebble-a" },
  { id: "fact2", shape: "pebble-b" },
  { id: "fact3", shape: "pebble-c" },
  { id: "fact4", shape: "pebble-d" },
] as const;

export function About() {
  const t = useTranslations("About");
  const profile = useTranslations("Profile");
  const common = useTranslations("Common");
  const [open, setOpen] = useState<(typeof facts)[number]["id"] | null>(null);
  const active = facts.find((fact) => fact.id === open);

  return (
    <section id="about" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -right-8 top-10 h-36 w-36 rounded-[55%_45%_60%_40%] bg-sky-100" />
          <SpeakerFrame
            src={photos.feeling}
            alt={profile("name")}
            frame="about"
            className="relative aspect-[4/5] w-full"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
            <h2 className="font-display mt-3 text-4xl text-sky-700 sm:text-5xl">{t("title")}</h2>
            <p className="mt-5 text-lg leading-8 text-ink">{t("lead")}</p>
            <p className="mt-4 leading-8 text-ink-soft">{t("bio1")}</p>
            <p className="mt-4 leading-8 text-ink-soft">{t("bio2")}</p>
            <blockquote className="font-display mt-8 text-2xl leading-snug text-sky-700">
              {t("quote")}
            </blockquote>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((fact, index) => (
              <Reveal key={fact.id} delayMs={index * 70}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setOpen(fact.id)}
                  className={`glass-tile ${fact.shape} p-5`}
                >
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                    {t(`${fact.id}Label`)}
                  </p>
                  <p className="mt-1 font-medium text-ink">{t(`${fact.id}Value`)}</p>
                  <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                    {common("openDetails")}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <CardDrawer
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        eyebrow={active ? t(`${active.id}Label`) : t("eyebrow")}
        title={active ? t(`${active.id}Value`) : ""}
        body={active ? t(`${active.id}Detail`) : undefined}
        tiles={
          active
            ? [{ label: common("noteLabel"), value: t(`${active.id}Note`), wide: true }]
            : undefined
        }
      />
    </section>
  );
}
