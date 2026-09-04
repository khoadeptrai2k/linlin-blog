"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { profileStorageKey, readStudyAccount, type StudyAccount } from "@/lib/learn/progress";
import type { Catalog } from "@/lib/learn/types";

type Goal = "communicate" | "hsk";
type Level = "new" | "a1" | "a2" | "b1";
type Profile = {
  name: string;
  track: Locale;
  goal: Goal;
  level: Level;
  xp: number;
  water: number;
  streak: number;
  missions: Record<string, boolean>;
};

const levelScore: Record<Level, number> = {
  new: 0,
  a1: 1,
  a2: 2,
  b1: 3,
};

const pinyinRows = {
  tone: ["ma1 - ma2 - ma3 - ma4", "mā - má - mǎ - mà"],
  initial: ["b p m f", "d t n l", "g k h", "j q x", "zh ch sh r", "z c s"],
  final: ["a o e i u ü", "ai ei ao ou", "an en ang eng", "ia ie iao iu", "ua uo uai ui"],
} as const;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultProfile(): Profile {
  return {
    name: "",
    track: "zh",
    goal: "communicate",
    level: "new",
    xp: 0,
    water: 0,
    streak: 0,
    missions: {},
  };
}

function baseProfile(track: Locale): Profile {
  return { ...defaultProfile(), track };
}

function readProfile(accountId: string, fallbackTrack: Locale) {
  try {
    const raw = localStorage.getItem(profileStorageKey(accountId));
    return raw ? ({ ...baseProfile(fallbackTrack), ...JSON.parse(raw) } as Profile) : baseProfile(fallbackTrack);
  } catch {
    return baseProfile(fallbackTrack);
  }
}

function writeProfile(accountId: string, profile: Profile) {
  localStorage.setItem(profileStorageKey(accountId), JSON.stringify(profile));
}

export function LearnPlanner({ catalog, locale }: { catalog: Catalog; locale: Locale }) {
  const t = useTranslations("Learn");
  const [account, setAccount] = useState<StudyAccount>({ id: "guest", name: "" });
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<Profile>(() => baseProfile(locale));
  const [answers, setAnswers] = useState<Record<string, Level>>({});
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const track = catalog.tracks.find((item) => item.id === profile.track) ?? catalog.tracks[0];
  const today = todayKey();
  const displayName = account.name.trim() || t("guestName");

  const placementQuestions = useMemo(
    () =>
      [
        {
          id: "sound",
          text: t("qSound"),
          answers: [
            { label: t("aSound0"), score: "new" as const },
            { label: t("aSound1"), score: "a1" as const },
            { label: t("aSound2"), score: "a2" as const },
          ],
        },
        {
          id: "words",
          text: t("qWords"),
          answers: [
            { label: t("aWords0"), score: "new" as const },
            { label: t("aWords1"), score: "a1" as const },
            { label: t("aWords2"), score: "a2" as const },
          ],
        },
        {
          id: "speak",
          text: t("qSpeak"),
          answers: [
            { label: t("aSpeak0"), score: "new" as const },
            { label: t("aSpeak1"), score: "a1" as const },
            { label: t("aSpeak2"), score: "b1" as const },
          ],
        },
      ] as const,
    [t],
  );

  const pinyinGroups = useMemo(
    () => [
      { title: t("toneGroup"), rows: pinyinRows.tone },
      { title: t("initialGroup"), rows: pinyinRows.initial },
      { title: t("finalGroup"), rows: pinyinRows.final },
    ],
    [t],
  );

  const testQueue = useMemo(
    () =>
      [
        { title: t("test1Title"), body: t("test1Body"), track: "zh" as const },
        { title: t("test2Title"), body: t("test2Body"), track: "en" as const },
        { title: t("test3Title"), body: t("test3Body"), track: "zh" as const },
      ] as const,
    [t],
  );

  const missions = useMemo(
    () => [
      { id: "review", label: t("missionReview"), body: t("missionReviewBody"), water: 1 },
      { id: "shadow", label: t("missionShadow"), body: t("missionShadowBody"), water: 2 },
      { id: "test", label: t("missionTest"), body: t("missionTestBody"), water: 1 },
    ],
    [t],
  );

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(async () => {
      const currentAccount = readStudyAccount();
      const localProfile = readProfile(currentAccount.id, locale);
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const result = (await response.json()) as {
            user: { id: string; name: string };
            profile?: Partial<Profile>;
          };
          if (!active) return;
          setAccount({ id: result.user.id, name: result.user.name });
          setSignedIn(true);
          setProfile({
            ...baseProfile(locale),
            ...result.profile,
            name: result.user.name,
            track: result.profile?.track ?? locale,
          });
          setLoaded(true);
          return;
        }
      } catch {
        // Local progress remains available when the account service is offline.
      }
      if (!active) return;
      setAccount(currentAccount.id === "guest" ? { id: "guest", name: "" } : currentAccount);
      setProfile({ ...baseProfile(locale), ...localProfile, track: localProfile.track ?? locale });
      setLoaded(true);
    });
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [locale]);

  useEffect(() => {
    if (!loaded) return;
    const timer = window.setTimeout(() => {
      if (signedIn) {
        void fetch("/api/profile", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(profile),
        });
      } else {
        writeProfile(account.id, profile);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [account.id, loaded, profile, signedIn]);

  const estimatedLevel = useMemo(() => {
    const values = Object.values(answers);
    if (!values.length) return profile.level;
    const avg = values.reduce((sum, item) => sum + levelScore[item], 0) / values.length;
    if (avg >= 2.7) return "b1";
    if (avg >= 1.7) return "a2";
    if (avg >= 0.7) return "a1";
    return "new";
  }, [answers, profile.level]);

  function update(next: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...next }));
  }

  function completeMission(id: string, water = 1) {
    if (profile.missions[`${today}:${id}`]) return;
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      water: Math.min(12, prev.water + water),
      streak: Math.max(1, prev.streak),
      missions: { ...prev.missions, [`${today}:${id}`]: true },
    }));
  }

  return (
    <section className="duo-planner">
      <div className="duo-planner-head">
        <div className="duo-profile-intro">
          <p className="duo-kicker">{t("spaceEyebrow")}</p>
          <h2>{t("helloName", { name: displayName })}</h2>
          <p>{t("setupLead")}</p>
          <div className="duo-status-row" aria-label={t("summaryAria")}>
            <span>
              <b>{profile.level.toUpperCase()}</b>
              {t("levelLabel")}
            </span>
            <span>
              <b>{profile.goal === "hsk" ? "HSK" : t("talkShort")}</b>
              {t("goalLabelShort")}
            </span>
            <span>
              <b>{localeMeta[profile.track].native}</b>
              {t("trackLabel")}
            </span>
          </div>
        </div>
        <Link href="/account" className="duo-account-card">
          <span className="duo-account-link">
            <span className="duo-account-avatar">{displayName.slice(0, 1).toUpperCase()}</span>
            <span>
              <small>{signedIn ? t("synced") : t("notSignedIn")}</small>
              <strong>{displayName}</strong>
            </span>
            <b>{signedIn ? t("profileCta") : t("signInCta")}</b>
          </span>
        </Link>
      </div>

      <div className="duo-planner-grid">
        <div className="duo-setup-card">
          <nav className="duo-setup-tabs" aria-label={t("setupNav")} role="tablist">
            {[
              { step: 1 as const, label: t("tabLevel"), value: profile.level.toUpperCase() },
              { step: 2 as const, label: t("tabLang"), value: localeMeta[profile.track].native },
              { step: 3 as const, label: t("tabGoal"), value: profile.goal === "hsk" ? "HSK" : t("talkShort") },
            ].map(({ step, label, value }) => (
              <button
                key={step}
                type="button"
                role="tab"
                className={activeStep === step ? "is-on" : ""}
                aria-selected={activeStep === step}
                onClick={() => setActiveStep(step)}
              >
                <span>{step}</span>
                <b>{label}</b>
                <small>{value}</small>
              </button>
            ))}
          </nav>

          <div className="duo-setup-body">
            {activeStep === 1 ? (
              <div className="duo-panel duo-panel-focus">
                <p className="duo-panel-step">{t("stepN", { n: 1 })}</p>
                <h3>{t("assessTitle")}</h3>
                <p className="duo-panel-lead">{t("assessLead")}</p>
                <div className="mt-5 grid gap-4">
                  {placementQuestions.map((question) => (
                    <fieldset key={question.id} className="duo-fieldset">
                      <legend>{question.text}</legend>
                      <div className="duo-choice-row">
                        {question.answers.map((answer) => (
                          <button
                            key={answer.label}
                            type="button"
                            className={answers[question.id] === answer.score ? "is-on" : ""}
                            onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: answer.score }))}
                          >
                            {answer.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <button type="button" className="duo-unit-cta mt-5" onClick={() => { update({ level: estimatedLevel }); setActiveStep(2); }}>
                  {t("saveLevelContinue", { level: estimatedLevel.toUpperCase() })}
                </button>
              </div>
            ) : null}

            {activeStep === 2 ? (
              <div className="duo-panel duo-panel-focus">
                <p className="duo-panel-step">{t("stepN", { n: 2 })}</p>
                <h3>{t("pickLangTitle")}</h3>
                <p className="duo-panel-lead">{t("pickLangLead")}</p>
                <div className="duo-language-grid mt-5">
                  {catalog.tracks.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={profile.track === item.id ? "is-on" : ""}
                      onClick={() => update({ track: item.id })}
                    >
                      <strong>{localeMeta[item.id].native}</strong>
                      <span>{localeMeta[item.id].label} · {t("lessonCountShort", { n: item.lessonCount })}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="duo-unit-cta mt-5" onClick={() => setActiveStep(3)}>
                  {t("continueWith", { name: localeMeta[profile.track].native })}
                </button>
              </div>
            ) : null}

            {activeStep === 3 ? (
              <div className="duo-panel duo-panel-focus">
                <p className="duo-panel-step">{t("stepN", { n: 3 })}</p>
                <h3>{t("goalPickTitle")}</h3>
                <p className="duo-panel-lead">{t("goalPickLead")}</p>
                <div className="duo-goal-grid mt-5">
                  <button type="button" className={profile.goal === "communicate" ? "is-on" : ""} onClick={() => update({ goal: "communicate" })}>
                    <strong>{t("goalTalkTitle")}</strong>
                    <span>{t("goalTalkBody")}</span>
                  </button>
                  <button type="button" className={profile.goal === "hsk" ? "is-on" : ""} onClick={() => update({ goal: "hsk", track: "zh" })}>
                    <strong>{t("goalHskTitle")}</strong>
                    <span>{t("goalHskBody")}</span>
                  </button>
                </div>
                {profile.goal === "hsk" ? (
                  <div className="duo-pinyin mt-5">
                    <p className="duo-kicker">{t("pinyinQuick")}</p>
                    {pinyinGroups.map((group) => (
                      <div key={group.title}>
                        <strong>{group.title}</strong>
                        {group.rows.map((row) => (
                          <button key={row} type="button" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(row.replace(/\d/g, "")))}>
                            {row} <span>{t("playAudio")}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
                <Link href={`/learn/${track.id}`} className="duo-main-cta mt-5">
                  {t("startPath", { name: localeMeta[track.id].native })}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="duo-today-card">
          <div className="duo-garden" aria-label={t("rewardAria")}>
            <div className="duo-garden-copy">
              <span>{t("rewardToday")}</span>
              <strong>{t("waterCount", { n: profile.water })}</strong>
              <small>{t("xpStreak", { xp: profile.xp, n: profile.streak })}</small>
            </div>
            <div className="duo-water-meter"><span style={{ width: `${Math.min(100, (profile.water / 12) * 100)}%` }} /></div>
          </div>
          <div className="duo-today-head">
            <div>
              <p className="duo-kicker">{t("dailyQuest")}</p>
              <h3>{t("missionsTitle")}</h3>
            </div>
            <span>{missions.filter((mission) => profile.missions[`${today}:${mission.id}`]).length}/3</span>
          </div>
          <div className="duo-mission-list">
            {missions.map((mission, index) => {
              const done = Boolean(profile.missions[`${today}:${mission.id}`]);
              return (
                <button
                  key={mission.id}
                  type="button"
                  className={`duo-mission ${done ? "is-done" : ""}`}
                  onClick={() => completeMission(mission.id, mission.water)}
                >
                  <b>{done ? "✓" : index + 1}</b>
                  <span>
                    <strong>{mission.label}</strong>
                    <small>{mission.body}</small>
                  </span>
                  <em>{done ? t("doneShort") : `+${mission.water}`}</em>
                </button>
              );
            })}
          </div>
          <div className="duo-shadow">
            <span>{t("shadowTime")}</span>
            <strong>{t("shadowHead")}</strong>
            <p>{t("shadowHint")}</p>
          </div>
          <Link href={`/learn/${track.id}`} className="duo-main-cta">
            {t("studyNow")}
          </Link>
        </aside>
      </div>

      <div className="duo-test-section">
        <div className="duo-track-heading">
          <div>
            <p className="duo-kicker">{t("tryEyebrow")}</p>
            <h3>{t("testsTitle")}</h3>
          </div>
          <p>{t("testsLead")}</p>
        </div>
        <div className="duo-test-grid">
          {testQueue.map((test, index) => (
            <Link key={test.title} href={`/learn/${test.track}`} className="duo-test-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{test.title}</strong>
              <small>{test.body}</small>
              <b>{t("startArrow")}</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
