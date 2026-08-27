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
  const [level, setLevel] = useState(meta.units[0]?.level ?? "A1");
  const [openId, setOpenId] = useState(meta.units[0]?.id ?? "");

  useEffect(() => {
    const map = loadDone(track);
    setDone(map);
    const next = allIds.find((id) => !map[id]) ?? allIds[0];
    const unit = meta.units.find((item) => item.lessonIds.includes(next));
    if (unit) {
      setLevel(unit.level);
      setOpenId(unit.id);
    }
  }, [track, allIds, meta.units]);

  const nextId = allIds.find((id) => !done[id]) ?? allIds[0];
  const nextUnit = meta.units.find((unit) => unit.lessonIds.includes(nextId));
  const doneCount = allIds.filter((id) => done[id]).length;
  const finished = doneCount === allIds.length && allIds.length > 0;
  const units = meta.units.filter((unit) => unit.level === level);

  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-xl">
        <Link href="/learn" className="text-sm font-semibold text-sky-700">
          ← {t("allTracks")}
        </Link>

        <article className="glass-tile mt-6 p-6 sm:p-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">{native}</p>
          <h1 className="font-display mt-2 text-3xl leading-tight text-sky-700 sm:text-4xl">{t("classTitle")}</h1>
          <p className="mt-3 leading-7 text-ink-soft">{t("classLead")}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-sky-700"
              style={{ width: `${allIds.length ? (doneCount / allIds.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-sky-700">
            {t("doneCount", { done: doneCount, total: allIds.length })}
          </p>
          {nextUnit && nextId ? (
            <div className="mt-5">
              <p className="text-sm text-ink-soft">
                {finished ? t("allDone") : t("continueFrom", { chapter: nextUnit.title[track] })}
              </p>
              {support && !finished ? (
                <p className="text-xs text-ink-soft">{nextUnit.title[support]}</p>
              ) : null}
              <Link href={`/learn/${track}/${nextId}`} className="btn-primary mt-4 inline-flex">
                {finished ? t("reviewClass") : doneCount ? t("resume") : t("enterClass")}
              </Link>
            </div>
          ) : null}
        </article>

        <div className="mt-8 flex flex-wrap gap-2">
          {levels.map((item) => (
            <button
              key={item}
              type="button"
              className={item === level ? "btn-primary py-2" : "btn-ghost py-2"}
              onClick={() => {
                setLevel(item);
                const first = meta.units.find((unit) => unit.level === item);
                if (first) setOpenId(first.id);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{t("levelHint")}</p>

        <ol className="mt-5 grid gap-2">
          {units.map((unit, index) => {
            const unitDone = unit.lessonIds.filter((id) => done[id]).length;
            const open = openId === unit.id;
            const here = nextUnit?.id === unit.id && !finished;
            return (
              <li key={unit.id} className="overflow-hidden rounded-[1.4rem] bg-white/55">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setOpenId(open ? "" : unit.id)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-700 font-display text-sm text-white">
                    {meta.units.findIndex((item) => item.id === unit.id) + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-sky-700">{unit.title[track]}</span>
                    {support ? <span className="block truncate text-xs text-ink-soft">{unit.title[support]}</span> : null}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-sky-700">
                    {here ? t("youAreHere") : `${unitDone}/${unit.lessonIds.length}`}
                  </span>
                </button>
                {open ? (
                  <ol className="grid grid-cols-5 gap-1 px-3 pb-3">
                    {unit.lessonIds.map((id) => {
                      const key = STEP_KEY[kindFromId(id) as keyof typeof STEP_KEY];
                      return (
                        <li key={id}>
                          <Link
                            href={`/learn/${track}/${id}`}
                            className={`block rounded-2xl px-1 py-2 text-center text-[0.65rem] font-semibold tracking-[0.08em] uppercase ${
                              done[id] ? "bg-sky-700 text-white" : id === nextId ? "bg-gold-500/80 text-white" : "bg-white/80 text-sky-700"
                            }`}
                          >
                            {key ? t(key) : index + 1}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
