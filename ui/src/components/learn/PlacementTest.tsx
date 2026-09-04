"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { pickI18n } from "@/lib/learn/language";
import { placementQuestions, type PlacementLevel } from "@/lib/learn/placement";
import type { LearnTrack } from "@/lib/learn/types";

const TRACKS: LearnTrack[] = ["zh", "en", "vi", "th"];

type Result = {
  level: PlacementLevel;
  score: number;
  total: number;
  track: LearnTrack;
  startUnitId?: string;
  startLessonId?: string;
};

export function PlacementTest({
  initialTrack,
  existing,
}: {
  initialTrack: LearnTrack;
  existing?: Result | null;
}) {
  const t = useTranslations("Learn");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [track, setTrack] = useState<LearnTrack>(initialTrack);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(existing || null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (response) => {
        const payload = (await response.json()) as { user?: { id: string } | null };
        if (!active) return;
        if (!payload.user) {
          setAuthed(false);
          router.replace("/account?next=/learn/placement");
          return;
        }
        setAuthed(true);
      })
      .catch(() => {
        if (active) setAuthed(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  const questions = useMemo(() => placementQuestions(track), [track]);
  const current = questions[index];
  const picked = current ? answers[current.id] : "";
  const doneCount = questions.filter((item) => answers[item.id]).length;

  async function submit() {
    if (questions.some((item) => !answers[item.id])) {
      setError(t("placementNeedAll"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/placement", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ track, answers }),
      });
      const payload = (await response.json()) as Result & { error?: string };
      if (!response.ok) {
        setError(payload.error === "UNAUTHORIZED" ? t("placementNeedLogin") : t("placementFailed"));
        return;
      }
      setResult(payload);
    } catch {
      setError(t("placementFailed"));
    } finally {
      setBusy(false);
    }
  }

  if (authed === false) {
    return (
      <section className="placement-shell">
        <p className="duo-kicker">{t("placementEyebrow")}</p>
        <h1>{t("placementNeedLogin")}</h1>
        <p className="placement-lead">{t("placementLead")}</p>
        <div className="placement-actions">
          <Link href="/account?next=/learn/placement" className="duo-main-cta">
            {t("placementNeedLoginCta")}
          </Link>
        </div>
      </section>
    );
  }

  if (authed !== true) {
    return (
      <section className="placement-shell" aria-busy="true">
        <p className="duo-kicker">{t("placementEyebrow")}</p>
        <h1>{t("placementTitle")}</h1>
        <p className="placement-lead">{t("placementLead")}</p>
      </section>
    );
  }

  if (result) {
    const startHref = result.startLessonId
      ? `/learn/${result.track}/${result.startLessonId}`
      : `/learn/${result.track}`;
    return (
      <section className="placement-shell">
        <p className="duo-kicker">{t("placementEyebrow")}</p>
        <h1>{t("placementResultTitle")}</h1>
        <p className="placement-lead">{t("placementResultLead", { name: localeMeta[result.track].native })}</p>
        <div className="placement-result">
          <span>{t("placementLevel")}</span>
          <strong>{result.level.toUpperCase()}</strong>
          <small>{t("placementScore", { score: result.score, total: result.total })}</small>
        </div>
        <p>{t(`placementBlurb_${result.level}`)}</p>
        <div className="placement-actions">
          <Link href={startHref} className="duo-main-cta">
            {t("placementStart")}
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setResult(null);
              setIndex(0);
              setAnswers({});
            }}
          >
            {t("placementRetake")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="placement-shell">
      <p className="duo-kicker">{t("placementEyebrow")}</p>
      <h1>{t("placementTitle")}</h1>
      <p className="placement-lead">{t("placementLead")}</p>

      <div className="placement-tracks" role="tablist" aria-label={t("placementTrack")}>
        {TRACKS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            className={track === item ? "is-on" : ""}
            onClick={() => {
              setTrack(item);
              setIndex(0);
              setAnswers({});
              setError("");
            }}
          >
            {localeMeta[item].native}
          </button>
        ))}
      </div>

      <p className="placement-progress">
        {t("placementProgress", { n: Math.min(questions.length, doneCount + (picked ? 0 : 1)), total: questions.length })}
      </p>
      <div className="placement-meter">
        <span style={{ width: `${(doneCount / questions.length) * 100}%` }} />
      </div>

      {current ? (
        <div className="placement-card">
          <p className="learn-kicker">{t("placementPrompt")}</p>
          <p className="placement-stem">{current.stem}</p>
          <div className="placement-choices">
            {current.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={picked === choice.id ? "is-on" : ""}
                onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: choice.id }))}
              >
                {pickI18n(choice.label, locale, track)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="account-error">{error}</p> : null}

      <div className="placement-nav">
        <button type="button" className="btn-ghost" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>
          {t("back")}
        </button>
        {index < questions.length - 1 ? (
          <button type="button" className="duo-main-cta" disabled={!picked} onClick={() => setIndex((value) => value + 1)}>
            {t("nextItem")}
          </button>
        ) : (
          <button type="button" className="duo-main-cta" disabled={busy || doneCount < questions.length} onClick={submit}>
            {busy ? t("placementScoring") : t("placementSubmit")}
          </button>
        )}
      </div>
    </section>
  );
}
