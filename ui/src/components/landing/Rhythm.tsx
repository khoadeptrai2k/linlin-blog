"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { OrganicImage, type OrganicFrame } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { GlassSheet } from "@/components/ui/GlassSheet";
import { photos } from "@/lib/photos";

const sessions: {
  id: "session1" | "session2" | "session3" | "session4";
  src: string;
  frame: OrganicFrame;
}[] = [
  { id: "session1", src: photos.morning, frame: "pebbleA" },
  { id: "session2", src: photos.notes, frame: "pebbleB" },
  { id: "session3", src: photos.practice, frame: "pebbleC" },
  { id: "session4", src: photos.listen, frame: "pebbleD" },
];

export function Rhythm() {
  const t = useTranslations("Rhythm");
  const router = useRouter();
  const [open, setOpen] = useState<(typeof sessions)[number]["id"] | null>(null);
  const active = sessions.find((session) => session.id === open);

  return (
    <section id="rhythm" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sessions.map((session, index) => (
            <Reveal key={session.id} delayMs={index * 70}>
              <button
                type="button"
                onClick={() => setOpen(session.id)}
                aria-haspopup="dialog"
                className={`glass-tile ${session.frame} grid gap-5 p-4 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:p-5 ${
                  index % 2 ? "md:translate-y-6" : ""
                }`}
              >
                <OrganicImage
                  src={session.src}
                  alt={t(`${session.id}Title`)}
                  frame={session.frame}
                  hud={t(`${session.id}Time`)}
                  className="aspect-[4/5] w-full sm:aspect-square"
                />
                <div className="px-2 pb-2 sm:px-1 sm:pb-0">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                    {t(`${session.id}Time`)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{t(`${session.id}Title`)}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{t(`${session.id}Body`)}</p>
                  <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                    {t("openSession")}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <GlassSheet
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        title={active ? t(`${active.id}Time`) : t("title")}
        variant="drawer"
      >
        {active ? (
          <div>
            <OrganicImage
              src={active.src}
              alt={t(`${active.id}Title`)}
              frame="wide"
              className="mt-1 aspect-[16/9] w-full"
            />
            <h3 className="font-display mt-4 pr-8 text-3xl text-sky-700">
              {t(`${active.id}Title`)}
            </h3>
            <p className="mt-3 leading-7 text-ink-soft">{t(`${active.id}Body`)}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              <li className="control-tile min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("durationLabel")}
                </span>
                <span className="text-sm font-semibold">{t(`${active.id}Duration`)}</span>
              </li>
              <li className="control-tile min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("whenLabel")}
                </span>
                <span className="text-sm font-semibold">{t(`${active.id}When`)}</span>
              </li>
              <li className="control-tile col-span-2 min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("goalLabel")}
                </span>
                <span className="text-sm font-semibold leading-6">{t(`${active.id}Goal`)}</span>
              </li>
            </ul>
            <p className="mt-5 px-1 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
              {t("stepsLabel")}
            </p>
            <ol className="mt-2 space-y-2">
              {(["Step1", "Step2", "Step3"] as const).map((step, index) => (
                <li key={step} className="control-tile min-h-0">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-[0.7rem] font-semibold text-sky-700">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold leading-6">{t(`${active.id}${step}`)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <ul className="mt-3 grid gap-2">
              <li className="control-tile min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("needLabel")}
                </span>
                <span className="text-sm font-semibold leading-6">{t(`${active.id}Need`)}</span>
              </li>
              <li className="control-tile min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("stopLabel")}
                </span>
                <span className="text-sm font-semibold leading-6">{t(`${active.id}Stop`)}</span>
              </li>
              <li className="control-tile min-h-0">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  {t("sampleLabel")}
                </span>
                <span className="text-sm font-semibold leading-6">{t(`${active.id}Sample`)}</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={() => {
                setOpen(null);
                router.push("/learn");
              }}
            >
              {t("startSession")}
            </button>
          </div>
        ) : null}
      </GlassSheet>
    </section>
  );
}
