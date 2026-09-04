"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { readDone, readStudyAccount, type StudyAccount } from "@/lib/learn/progress";
import { startUnitForLevel, type PlacementLevel } from "@/lib/learn/placement";
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
  const levels = useMemo(() => [...new Set(meta.units.map((unit) => unit.level))], [meta.units]);
  const allIds = useMemo(() => meta.units.flatMap((unit) => unit.lessonIds), [meta.units]);

  const [done, setDone] = useState<Record<string, boolean>>({});
  const [focusId, setFocusId] = useState(meta.units[0]?.id ?? "");
  const [account, setAccount] = useState<StudyAccount | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [placement, setPlacement] = useState<{ done: boolean; level: PlacementLevel } | null>(null);

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(async () => {
      const currentAccount = readStudyAccount();
      let map = readDone(track, currentAccount.id);
      let nextAccount = currentAccount;
      let signed = false;
      let placed: { done: boolean; level: PlacementLevel } | null = null;
      try {
        const [progressResponse, userResponse, profileResponse] = await Promise.all([
          fetch(`/api/progress?track=${track}`),
          fetch("/api/auth/me"),
          fetch("/api/profile"),
        ]);
        if (progressResponse.ok) {
          const result = (await progressResponse.json()) as { done?: Record<string, boolean> };
          map = result.done ?? map;
        }
        if (userResponse.ok) {
          const result = (await userResponse.json()) as { user?: { id: string; name: string } };
          if (result.user) {
            nextAccount = { id: result.user.id, name: result.user.name };
            signed = true;
          }
        }
        if (profileResponse.ok) {
          const result = (await profileResponse.json()) as {
            profile?: { placementDone?: boolean; level?: PlacementLevel };
          };
          if (result.profile) {
            placed = {
              done: Boolean(result.profile.placementDone),
              level: result.profile.level || "new",
            };
          }
        }
      } catch {
        // Keep the local study path usable offline.
      }
      if (!active) return;
      setAccount(nextAccount);
      setSignedIn(signed);
      setPlacement(placed);
      setDone(map);
      const anyDone = allIds.some((id) => map[id]);
      let next = allIds.find((id) => !map[id]) ?? allIds[0];
      if (!anyDone && placed?.done) {
        const unitId = startUnitForLevel(meta.units, placed.level);
        next = meta.units.find((item) => item.id === unitId)?.lessonIds[0] ?? next;
      }
      const unit = meta.units.find((item) => item.lessonIds.includes(next));
      if (unit) setFocusId(unit.id);
    });
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [track, allIds, meta.units]);

  const anyDone = allIds.some((id) => done[id]);
  const placedUnitId = placement?.done ? startUnitForLevel(meta.units, placement.level) : meta.units[0]?.id;
  const placedIndex = meta.units.findIndex((item) => item.id === placedUnitId);
  const nextId =
    !anyDone && placement?.done
      ? (meta.units.find((item) => item.id === placedUnitId)?.lessonIds[0] ?? allIds[0])
      : (allIds.find((id) => !done[id]) ?? allIds[0]);
  const nextUnit = meta.units.find((unit) => unit.lessonIds.includes(nextId));
  const doneCount = allIds.filter((id) => done[id]).length;
  const finished = doneCount === allIds.length && allIds.length > 0;
  const nextIndex = nextUnit ? meta.units.findIndex((unit) => unit.id === nextUnit.id) + 1 : 1;
  const xp = doneCount * 10;
  const progress = allIds.length ? Math.round((doneCount / allIds.length) * 100) : 0;

  return (
    <section className="duo-shell px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/learn" className="text-sm font-bold text-sky-700">
          ← {t("allTracks")}
        </Link>

        <article className="duo-path-head mt-5">
          <div className="min-w-0">
            <p className="duo-kicker">{native}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">{t("classTitle")}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink-soft">{t("pathSpine")}</p>
            {account ? (
              <Link href="/account" className="mt-3 inline-flex text-sm font-bold text-sky-700">
                {t("profileLink", { name: account.name })}
              </Link>
            ) : null}
          </div>
          <div className="duo-path-score">
            <span>{t("xpLabel", { xp })}</span>
            <strong>{progress}%</strong>
            <small>{t("doneCount", { done: doneCount, total: allIds.length })}</small>
          </div>
        </article>

        {!placement?.done ? (
          <Link href={signedIn ? "/learn/placement" : "/account?next=/learn/placement"} className="placement-banner">
            <strong>{t("placementBannerTitle")}</strong>
            <span>{signedIn ? t("placementBannerBody") : t("placementNeedLoginCta")}</span>
          </Link>
        ) : (
          <p className="placement-banner is-done">{t("placementOnPath", { level: placement.level.toUpperCase() })}</p>
        )}

        <div className="duo-path-layout">
          <aside className="duo-path-aside">
        <div className="duo-continue">
          <div className="min-w-0">
            <ol className="duo-mini-steps">
            {(["stepTeach", "stepWords", "stepListen", "stepPractice", "stepPlay"] as const).map((key, i) => (
              <li key={key}>
                {i + 1}. {t(key)}
              </li>
            ))}
            </ol>
            {nextUnit && nextId ? (
              <>
                <p className="mt-3 text-sm font-bold text-ink">
                  {nextUnit ? t("chapterN", { n: nextIndex, total: meta.units.length }) : ""}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                {finished ? t("allDone") : t("continueFrom", { chapter: nextUnit.title[locale] || nextUnit.title[track] })}
                </p>
              </>
            ) : null}
          </div>
          {nextUnit && nextId ? (
            <Link href={`/learn/${track}/${nextId}`} className="duo-main-cta">
              {finished ? t("reviewClass") : doneCount ? t("resume") : t("enterClass")}
            </Link>
          ) : null}
        </div>
            <div className="duo-path-guide">
              <p className="duo-kicker">{t("rhythmEyebrow")}</p>
              <h2>{t("rhythmTitle")}</h2>
              <ol>
                {(["stepTeach", "stepWords", "stepListen", "stepPractice", "stepPlay"] as const).map((key, i) => (
                  <li key={key}>
                    <span>{i + 1}</span>
                    <b>{t(key)}</b>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="duo-path-main">
        <div className="duo-track-heading">
          <div>
            <p className="duo-kicker">{t("pathTitle")}</p>
            <h2>{t("pickChapter")}</h2>
          </div>
          <p>{t("stage", { level: levels[0] ?? "A1" })}</p>
        </div>
        <ol className="duo-skill-path">
          {levels.map((level) => {
            const units = meta.units.filter((unit) => unit.level === level);
            const start = meta.units.findIndex((unit) => unit.level === level) + 1;
            return (
              <li key={level}>
                <p className="duo-level-label">
                  {t("stage", { level })} · {t("chapterRange", { from: start, to: start + units.length - 1 })}
                </p>
                <ol className="duo-unit-list">
                  {units.map((unit) => {
                    const n = meta.units.findIndex((item) => item.id === unit.id) + 1;
                    const unitDone = unit.lessonIds.filter((id) => done[id]).length;
                    const allDone = unitDone === unit.lessonIds.length && unit.lessonIds.length > 0;
                    const now = unit.id === focusId;
                    const here = nextUnit?.id === unit.id && !finished;
                    const previous = n <= 1 ? null : meta.units[n - 2];
                    const beforePlacement = !anyDone && placement?.done && n - 1 < placedIndex;
                    const locked =
                      beforePlacement
                        ? false
                        : !finished && !here && !allDone && previous
                          ? !previous.lessonIds.every((id) => done[id])
                          : false;
                    const lessonId = unit.lessonIds.find((id) => !done[id]) ?? unit.lessonIds[0];
                    return (
                      <li
                        key={unit.id}
                        className={`duo-unit ${now ? "is-open" : ""} ${here ? "is-here" : ""} ${allDone ? "is-done" : ""} ${locked ? "is-locked" : ""}`}
                      >
                        <button
                          type="button"
                          className="duo-unit-btn"
                          onClick={() => setFocusId(unit.id)}
                          aria-expanded={now}
                        >
                          <span className="duo-unit-node">
                            {allDone ? "✓" : locked ? "•" : n}
                          </span>
                          <span className="min-w-0 flex-1 text-left">
                            <span className="block font-bold text-ink">{unit.title[locale]}</span>
                            {locale !== track ? (
                              <span className="mt-0.5 block truncate text-xs text-ink-soft">{unit.title[track]}</span>
                            ) : null}
                          </span>
                          <span className="duo-unit-state">
                            {locked ? t("locked") : here ? t("youAreHere") : allDone ? t("done") : `${unitDone}/5`}
                          </span>
                        </button>
                        {now ? (
                          <div className="duo-unit-body">
                            {unit.goal?.[locale] || unit.goal?.[track] ? (
                              <p className="text-sm leading-6 text-ink-soft">{unit.goal?.[locale] || unit.goal?.[track]}</p>
                            ) : null}
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-sky-500" style={{ width: `${(unitDone / unit.lessonIds.length) * 100}%` }} />
                            </div>
                            <p className="mt-3 text-xs font-bold uppercase text-ink-soft">
                              {t("fiveSteps")}
                            </p>
                            <ol className="duo-step-grid mt-2">
                              {unit.lessonIds.map((id, i) => {
                                const key = STEP_KEY[kindFromId(id) as keyof typeof STEP_KEY];
                                return (
                                  <li key={id}>
                                    <Link
                                      href={`/learn/${track}/${id}`}
                                      className={`duo-step-tile ${
                                        done[id]
                                          ? "is-done"
                                          : id === nextId
                                            ? "is-now"
                                            : locked
                                              ? "is-locked"
                                              : ""
                                      }`}
                                    >
                                      {i + 1}. {key ? t(key) : "·"}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ol>
                            {lessonId ? (
                              <Link href={`/learn/${track}/${lessonId}`} className="duo-unit-cta mt-3 inline-flex">
                                {allDone ? t("practiceAgain") : locked ? t("preview") : t("startLesson")}
                              </Link>
                            ) : null}
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
        </div>
      </div>
    </section>
  );
}
