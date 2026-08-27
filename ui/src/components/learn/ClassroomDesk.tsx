"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import type { CatalogTrack, LearnTrack, Lesson } from "@/lib/learn/types";

const STEP_KEY = {
  teach: "stepTeach",
  words: "stepWords",
  listen: "stepListen",
  practice: "stepPractice",
  play: "stepPlay",
} as const;

const KINDS: Lesson["kind"][] = ["teach", "words", "listen", "practice", "play", "review", "drill"];

function kindFromId(id: string): Lesson["kind"] {
  const part = id.split("-").at(-2);
  return KINDS.includes(part as Lesson["kind"]) ? (part as Lesson["kind"]) : "teach";
}

function loadDone(track: string) {
  try {
    const raw = localStorage.getItem(`linlin-learn:${track}`);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function ClassroomDesk({
  locale,
  track,
  meta,
}: {
  locale: Locale;
  track: LearnTrack;
  meta: CatalogTrack;
}) {
  const t = useTranslations("Learn");
  const native = localeMeta[track].native;
  const support = locale === track ? null : locale;
  const levels = useMemo(() => [...new Set(meta.units.map((unit) => unit.level))], [meta.units]);
  const allIds = useMemo(() => meta.units.flatMap((unit) => unit.lessonIds), [meta.units]);

  const [done, setDone] = useState<Record<string, boolean>>({});
  const [focusId, setFocusId] = useState(meta.units[0]?.id ?? "");

  useEffect(() => {
    const map = loadDone(track);
    setDone(map);
    const next = allIds.find((id) => !map[id]) ?? allIds[0];
    const unit = meta.units.find((item) => item.lessonIds.includes(next));
    if (unit) setFocusId(unit.id);
  }, [track, allIds, meta.units]);

  const nextId = allIds.find((id) => !done[id]) ?? allIds[0];
  const nextUnit = meta.units.find((unit) => unit.lessonIds.includes(nextId));
  const doneCount = allIds.filter((id) => done[id]).length;
  const finished = doneCount === allIds.length && allIds.length > 0;
  const nextIndex = nextUnit ? meta.units.findIndex((unit) => unit.id === nextUnit.id) + 1 : 1;

  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/learn" className="text-sm font-semibold text-sky-700">
          ← {t("allTracks")}
        </Link>

        <article className="glass-tile mt-6 p-6 sm:p-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">{native}</p>
          <h1 className="font-display mt-2 text-3xl leading-tight text-sky-700 sm:text-4xl">{t("classTitle")}</h1>
          <p className="mt-3 leading-7 text-ink-soft">{t("pathSpine")}</p>
          <ol className="mt-4 flex flex-wrap gap-2 text-[0.7rem] font-semibold tracking-[0.08em] text-sky-700 uppercase">
            {(["stepTeach", "stepWords", "stepListen", "stepPractice", "stepPlay"] as const).map((key, i) => (
              <li key={key} className="rounded-full bg-white/70 px-2.5 py-1">
                {i + 1}. {t(key)}
              </li>
            ))}
          </ol>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-sky-700"
              style={{ width: `${allIds.length ? (doneCount / allIds.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-sky-700">
            {t("doneCount", { done: doneCount, total: allIds.length })}
            {nextUnit ? ` · ${t("chapterN", { n: nextIndex, total: meta.units.length })}` : ""}
          </p>
          {nextUnit && nextId ? (
            <div className="mt-5">
              <p className="text-sm text-ink-soft">
                {finished ? t("allDone") : t("continueFrom", { chapter: nextUnit.title[track] })}
              </p>
              {support && !finished ? <p className="text-xs text-ink-soft">{nextUnit.title[support]}</p> : null}
              {nextUnit.goal?.[track] && !finished ? (
                <p className="mt-1 text-sm leading-6 text-ink-soft">{nextUnit.goal[track]}</p>
              ) : null}
              <Link href={`/learn/${track}/${nextId}`} className="btn-primary mt-4 inline-flex">
                {finished ? t("reviewClass") : doneCount ? t("resume") : t("enterClass")}
              </Link>
            </div>
          ) : null}
        </article>

        <p className="mt-8 text-sm font-semibold text-sky-700">{t("pickChapter")}</p>
        <ol className="mt-3 grid gap-6">
          {levels.map((level) => {
            const units = meta.units.filter((unit) => unit.level === level);
            const start = meta.units.findIndex((unit) => unit.level === level) + 1;
            return (
              <li key={level}>
                <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-sky-700 uppercase">
                  {t("stage", { level })} · {t("chapterRange", { from: start, to: start + units.length - 1 })}
                </p>
                <ol className="grid gap-1.5">
                  {units.map((unit) => {
                    const n = meta.units.findIndex((item) => item.id === unit.id) + 1;
                    const unitDone = unit.lessonIds.filter((id) => done[id]).length;
                    const allDone = unitDone === unit.lessonIds.length && unit.lessonIds.length > 0;
                    const now = unit.id === focusId;
                    const here = nextUnit?.id === unit.id && !finished;
                    return (
                      <li key={unit.id} className={`learn-chapter ${now ? "is-open" : ""} ${here ? "is-here" : ""}`}>
                        <button
                          type="button"
                          className="learn-chapter-btn"
                          onClick={() => setFocusId(unit.id)}
                          aria-expanded={now}
                        >
                          <span className={`learn-chapter-n ${allDone ? "is-done" : ""} ${here ? "is-now" : ""}`}>
                            {allDone ? "✓" : n}
                          </span>
                          <span className="min-w-0 flex-1 text-left">
                            <span className="block font-semibold text-sky-700">{unit.title[track]}</span>
                            {support ? (
                              <span className="mt-0.5 block truncate text-xs text-ink-soft">{unit.title[support]}</span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-sky-700">
                            {here ? t("youAreHere") : `${unitDone}/5`}
                          </span>
                        </button>
                        {now ? (
                          <div className="learn-chapter-body">
                            {unit.goal?.[track] ? (
                              <p className="text-sm leading-6 text-ink-soft">{unit.goal[track]}</p>
                            ) : null}
                            <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                              {t("fiveSteps")}
                            </p>
                            <ol className="mt-2 grid grid-cols-5 gap-1">
                              {unit.lessonIds.map((id, i) => {
                                const key = STEP_KEY[kindFromId(id) as keyof typeof STEP_KEY];
                                return (
                                  <li key={id}>
                                    <Link
                                      href={`/learn/${track}/${id}`}
                                      className={`block rounded-xl px-1 py-2.5 text-center text-[0.62rem] font-semibold tracking-[0.06em] uppercase ${
                                        done[id]
                                          ? "bg-sky-700 text-white"
                                          : id === nextId
                                            ? "bg-gold-500 text-white"
                                            : "bg-white text-sky-700"
                                      }`}
                                    >
                                      {i + 1}. {key ? t(key) : "·"}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
