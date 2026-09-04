"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SpeakButton, speakQueue, type SpeakChunk } from "@/components/learn/LearnAudio";
import { ExampleShot, UnitScene, VocabStrip, WordPicture } from "@/components/learn/LessonArt";
import { localeMeta, type Locale } from "@/i18n/routing";
import { CHAPTER_SPINE, KIND_CRITERIA, KIND_STEP_KEY, STEP_COACH, isCoachCopy, lectureChunks, lineExplain, podcastLines, podcastSpeech, relatedSentences, spineIndex, teacherTheory } from "@/lib/learn/guide";
import { UI_SPEECH, pickI18n } from "@/lib/learn/language";
import type { Lesson } from "@/lib/learn/types";

export function LessonSpine({ kind }: { kind: Lesson["kind"] }) {
  const t = useTranslations("Learn");
  const here = spineIndex(kind);

  return (
    <ol className="lesson-spine" aria-label={t("spineLabel")}>
      {CHAPTER_SPINE.map((item, index) => (
        <li key={item} className={index === here ? "is-here" : index < here ? "is-done" : ""}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{t(KIND_STEP_KEY[item])}</b>
        </li>
      ))}
    </ol>
  );
}

export function LessonCoach({ step }: { step: string }) {
  const t = useTranslations("Learn");
  const key = STEP_COACH[step as keyof typeof STEP_COACH];
  if (!key) return null;
  return <p className="lesson-coach">{t(key)}</p>;
}

export function LinlinTeacher({ children }: { children: ReactNode }) {
  const t = useTranslations("Learn");
  return (
    <div className="linlin-teacher">
      <span className="linlin-teacher-face" aria-hidden="true">琳</span>
      <div className="min-w-0">
        <p className="learn-kicker">{t("teacherName")}</p>
        <div className="linlin-teacher-say">{children}</div>
      </div>
    </div>
  );
}

export function GlossLine({ text }: { text: string }) {
  const t = useTranslations("Learn");
  const value = text.trim();
  if (!value) return null;
  return (
    <span className="learn-gloss">
      <span className="learn-gloss-label">{t("glossLabel")}</span>
      {value}
    </span>
  );
}

export function TargetPhrase({
  text,
  gloss,
  reading,
  explain,
  uiLang,
  lang,
  native,
  slow,
  onSay,
  kicker,
  picture,
}: {
  text: string;
  gloss?: string;
  reading?: string;
  explain?: string;
  uiLang?: string;
  lang: string;
  native: string;
  slow: boolean;
  onSay: (text: string) => void;
  kicker?: string;
  picture?: string;
}) {
  const t = useTranslations("Learn");
  const meaning = (explain || gloss || "").trim();
  if (isCoachCopy(text) || isCoachCopy(meaning)) return null;
  const hasMeaning = Boolean(meaning && meaning !== text.trim());

  function play(event?: { stopPropagation: () => void }) {
    event?.stopPropagation();
    if (hasMeaning && uiLang) {
      speakQueue([{ text: meaning, lang: uiLang }, { text, lang }], lang, slow);
    } else {
      speakQueue([{ text, lang }], lang, slow);
    }
    onSay(text);
  }

  return (
    <div className="learn-target">
      <p className="learn-kicker">{kicker || t("learnThis", { name: native })}</p>
      <div className="learn-target-body">
        {picture ? <WordPicture emoji={picture} size="lg" label={text} /> : null}
        <button type="button" className="min-w-0 flex-1 text-left" onClick={play}>
          <span className="block text-xl font-bold leading-snug text-sky-700">{text}</span>
          {reading ? <span className="mt-1 block text-sm text-sky-700">{reading}</span> : null}
        </button>
        <SpeakButton
          text={text}
          lang={lang}
          slow={slow}
          label={hasMeaning ? t("hearBoth") : t("hear")}
          explain={hasMeaning ? meaning : undefined}
          uiLang={uiLang}
        />
      </div>
      {hasMeaning ? <GlossLine text={meaning} /> : null}
    </div>
  );
}

export function ExampleBank({
  lesson,
  locale,
  slow,
  onSay,
  around,
  limit = 5,
}: {
  lesson: Lesson;
  locale: Locale;
  slow: boolean;
  onSay: (text: string) => void;
  around?: string;
  limit?: number;
}) {
  const t = useTranslations("Learn");
  const rows = relatedSentences(lesson, locale, around, limit);
  if (!rows.length) return null;

  return (
    <div className="learn-examples">
      <p className="learn-kicker">{around ? t("moreLikeThis") : t("moreExamples")}</p>
      <ul className="mt-2 grid gap-2">
        {rows.map((item) => (
          <li key={`${item.text}-${item.reading}`}>
            <ExampleShot item={item} lesson={lesson} locale={locale} slow={slow} onSay={onSay} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LessonBrief({
  lesson,
  locale,
  guide,
  slow,
  onStart,
  onSay,
}: {
  lesson: Lesson;
  locale: Locale;
  guide?: Lesson | null;
  slow: boolean;
  onStart: () => void;
  onSay: (text: string) => void;
}) {
  const t = useTranslations("Learn");
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const goal = pickI18n(lesson.goal, locale, lesson.track);
  const note = teacherTheory(lesson, guide).levelNote;
  const criteria = KIND_CRITERIA[lesson.kind];
  const here = spineIndex(lesson.kind);
  const native = localeMeta[lesson.track].native;
  const uiName = localeMeta[locale].native;

  useEffect(() => () => stopRef.current?.(), []);

  function toggleLecture() {
    if (playing) {
      stopRef.current?.();
      stopRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    stopRef.current = speakQueue(lectureChunks(lesson, locale, guide), lesson.speechLang, slow, (index) => {
      if (index < 0) {
        setPlaying(false);
        stopRef.current = null;
      }
    });
  }

  return (
    <div className="lesson-brief">
      <UnitScene unitId={lesson.unitId} title={t("inThisScene")} caption={goal} />
      <LinlinTeacher>
        <p>{t("teacherIntro", { name: native })}</p>
        <p className="mt-2 leading-6">{goal}</p>
        {note && note !== goal ? <p className="mt-2 leading-6">{note}</p> : null}
      </LinlinTeacher>
      <p className="lesson-brief-meta">
        {t("spineStep", { n: here + 1, total: 5, name: t(KIND_STEP_KEY[CHAPTER_SPINE[here]]) })}
        <span>·</span>
        {t("minutesHint", { n: lesson.minutes })}
      </p>

      {lesson.vocab.length ? (
        <div className="mt-4">
          <p className="learn-kicker">{t("todayHear")}</p>
          <VocabStrip lesson={lesson} locale={locale} onSay={onSay} />
        </div>
      ) : null}

      <div className="mt-4">
        <p className="learn-kicker">{t("criteriaTitle")}</p>
        <ol className="lesson-criteria">
          {criteria.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ol>
      </div>

      <div className="lesson-lecture mt-4">
        <div>
          <p className="learn-kicker">{t("lectureKicker")}</p>
          <p className="mt-1 text-sm leading-6">{t("lectureHint")}</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{t("audioExplain", { name: native, ui: uiName })}</p>
        </div>
        <button type="button" className={playing ? "btn-ghost" : "btn-primary"} onClick={toggleLecture}>
          {playing ? t("stopLecture") : t("playLecture")}
        </button>
      </div>

      <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={onSay} limit={5} />

      <button type="button" className="duo-main-cta mt-5" onClick={onStart}>
        {t("startNow")}
      </button>
    </div>
  );
}

export function LessonPodcast({
  lesson,
  locale,
  guide,
  slow,
  heard,
  shadowRepeats,
  onHeard,
  onShadow,
  onSay,
}: {
  lesson: Lesson;
  locale: Locale;
  guide?: Lesson | null;
  slow: boolean;
  heard: boolean;
  shadowRepeats: number;
  onHeard: () => void;
  onShadow: (text: string) => void;
  onSay: (text: string) => void;
}) {
  const t = useTranslations("Learn");
  const lines = podcastLines(lesson);
  const speech = podcastSpeech(lesson, locale, guide);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const stopRef = useRef<(() => void) | null>(null);
  const goal = pickI18n(lesson.goal, locale, lesson.track);
  const note = teacherTheory(lesson, guide).levelNote;
  const native = localeMeta[lesson.track].native;
  const uiLang = UI_SPEECH[locale];

  useEffect(() => () => stopRef.current?.(), []);

  function playLine(line: string) {
    const explain = lineExplain(lesson, locale, line, guide);
    if (explain && explain !== line) {
      speakQueue([{ text: explain, lang: uiLang }, { text: line, lang: lesson.speechLang }], lesson.speechLang, slow);
    } else {
      speakQueue([{ text: line, lang: lesson.speechLang }], lesson.speechLang, slow);
    }
    onSay(line);
    if (!heard) onHeard();
  }

  function togglePodcast() {
    if (playing) {
      stopRef.current?.();
      stopRef.current = null;
      setPlaying(false);
      setActive(-1);
      return;
    }
    setPlaying(true);
    stopRef.current = speakQueue(speech.chunks, lesson.speechLang, slow, (index) => {
      if (index < 0) {
        setPlaying(false);
        setActive(-1);
        stopRef.current = null;
        onHeard();
        return;
      }
      setActive(speech.lineOf(index));
    });
  }

  return (
    <div className="learn-board lesson-podcast">
      <LinlinTeacher>
        <p>{t("podcastLead")}</p>
        <p className="mt-2 leading-6">{goal}</p>
        {note && note !== goal ? <p className="mt-2 leading-6">{note}</p> : null}
        <p className="mt-2 text-sm leading-6 text-ink-soft">{t("audioExplain", { name: native, ui: localeMeta[locale].native })}</p>
      </LinlinTeacher>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={togglePodcast}>
          {playing ? t("stopLecture") : t("playPodcast")}
        </button>
        {playing && active >= 0 ? (
          <span className="text-xs font-bold text-sky-700">{t("playingChapter", { n: active + 1, total: lines.length })}</span>
        ) : null}
      </div>
      <p className="learn-kicker mt-5">{t("learnThis", { name: native })}</p>
      <ol className="lesson-chapters">
        {lines.map((line, index) => {
          const gloss = lineExplain(lesson, locale, line, guide);
          const show = heard || playing || active === index;
          return (
            <li key={`${index}-${line}`} className={active === index ? "is-on" : ""}>
              <button type="button" onClick={() => playLine(line)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>
                  {show ? line : "····"}
                  {gloss ? <GlossLine text={gloss} /> : null}
                </b>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="duo-shadow mt-5">
        <strong>{t("shadowTitle")}</strong>
        <p>{t("shadowBody")}</p>
        <div className="mt-3 grid gap-2">
          {lines.slice(0, 3).map((textLine) => {
            const gloss = lineExplain(lesson, locale, textLine, guide);
            return (
              <button
                key={textLine}
                type="button"
                className="duo-shadow-line"
                onClick={() => {
                  playLine(textLine);
                  onShadow(textLine);
                }}
              >
                <span>
                  {heard ? textLine : "····"}
                  {gloss ? <GlossLine text={gloss} /> : null}
                </span>
                <b>{t("repeatNow")}</b>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs font-bold">{t("shadowCount", { n: shadowRepeats })}</p>
        {shadowRepeats < 3 ? <p className="mt-1 text-xs text-ink-soft">{t("needShadow", { n: 3 })}</p> : null}
      </div>
      <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={onSay} limit={5} />
    </div>
  );
}

export function LectureButton({
  chunks,
  fallbackLang,
  slow,
  playing,
  onPlaying,
}: {
  chunks: SpeakChunk[];
  fallbackLang: string;
  slow: boolean;
  playing: boolean;
  onPlaying: (value: boolean) => void;
}) {
  const t = useTranslations("Learn");
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  function toggle() {
    if (playing) {
      stopRef.current?.();
      stopRef.current = null;
      onPlaying(false);
      return;
    }
    onPlaying(true);
    stopRef.current = speakQueue(chunks, fallbackLang, slow, (index) => {
      if (index < 0) {
        onPlaying(false);
        stopRef.current = null;
      }
    });
  }

  if (!chunks.length) return null;
  return (
    <button type="button" className={playing ? "learn-speed is-on" : "learn-speed"} onClick={toggle}>
      {playing ? t("stopLecture") : t("playLecture")}
    </button>
  );
}
