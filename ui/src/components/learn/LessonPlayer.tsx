"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import type { Exercise, I18nText, Lesson } from "@/lib/learn/types";

function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.88;
  window.speechSynthesis.speak(utter);
}

function loadDone(track: string) {
  try {
    const raw = localStorage.getItem(`linlin-learn:${track}`);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveDone(track: string, id: string) {
  const next = { ...loadDone(track), [id]: true };
  localStorage.setItem(`linlin-learn:${track}`, JSON.stringify(next));
}

function sameTokens(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}

function hashSeed(value: string) {
  let h = 2166136261;
  for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: string) {
  const copy = [...items];
  let s = hashSeed(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(arr: string[], n: number, except: string, seed: string) {
  return seededShuffle(
    arr.filter((item) => item && item !== except),
    seed,
  ).slice(0, n);
}

function supportLocale(track: string, locale: Locale): Locale | null {
  return locale === track ? null : locale;
}

function isI18nText(value: I18nText | string): value is I18nText {
  return typeof value === "object" && value !== null && "vi" in value;
}

function extraExercises(
  lesson: Lesson,
  support: Locale | null,
  whatMeans: (word: string) => string,
  whichWord: (gloss: string) => string,
): Exercise[] {
  if (!support || lesson.vocab.length < 4) return [];
  const extras: Exercise[] = [];
  const glosses = lesson.vocab.map((item) => item.meaning[support]);
  const words = lesson.vocab.map((item) => item.word);

  lesson.vocab.forEach((item, index) => {
    const answer = item.meaning[support];
    const distractors = pick(glosses, 3, answer, `${lesson.id}-mean-${index}`);
    if (distractors.length < 2) return;
    extras.push({
      id: `${lesson.id}-rt-mean-${index}`,
      type: "mcq",
      prompt: whatMeans(item.word),
      options: seededShuffle([answer, ...distractors].slice(0, 4), `${lesson.id}-mean-opt-${index}`),
      answer,
    });
  });

  lesson.vocab.forEach((item, index) => {
    const answer = item.word;
    const distractors = pick(words, 3, answer, `${lesson.id}-pick-${index}`);
    if (distractors.length < 2) return;
    extras.push({
      id: `${lesson.id}-rt-pick-${index}`,
      type: "mcq",
      prompt: whichWord(item.meaning[support]),
      options: seededShuffle([answer, ...distractors].slice(0, 4), `${lesson.id}-pick-opt-${index}`),
      answer,
    });
  });

  return extras;
}

function stepsFor(kind: Lesson["kind"]) {
  if (kind === "drill") return ["theory", "quiz"] as const;
  if (kind === "practice") return ["theory", "apply", "quiz"] as const;
  if (kind === "listen") return ["theory", "listen", "quiz"] as const;
  if (kind === "review") return ["theory", "words", "usage", "lines", "quiz"] as const;
  return ["theory", "words", "usage", "lines", "apply", "quiz"] as const;
}

export function LessonPlayer({
  lesson,
  locale,
  nextId,
}: {
  lesson: Lesson;
  locale: Locale;
  nextId?: string;
}) {
  const t = useTranslations("Learn");
  const steps = stepsFor(lesson.kind);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const [showScript, setShowScript] = useState(false);

  const support = supportLocale(lesson.track, locale);
  const current = steps[step];
  const targetName = localeMeta[lesson.track].native;

  const quiz = useMemo(
    () => [
      ...lesson.exercises,
      ...extraExercises(
        lesson,
        support,
        (word) => t("whatMeans", { word }),
        (gloss) => t("whichWord", { gloss }),
      ),
    ],
    [lesson, support, t],
  );

  const score = useMemo(() => {
    let ok = 0;
    for (const exercise of quiz) {
      const given = answers[exercise.id];
      if (exercise.type === "order") {
        if (Array.isArray(given) && sameTokens(given, exercise.answer)) ok += 1;
      } else if (typeof given === "string" && given.trim().toLowerCase() === exercise.answer.trim().toLowerCase()) {
        ok += 1;
      }
    }
    return { ok, total: quiz.length };
  }, [answers, quiz]);

  function finish() {
    saveDone(lesson.track, lesson.id);
    setDone(true);
  }

  function promptOf(exercise: Exercise) {
    if (exercise.type === "mcq" && exercise.promptKey === "whichPattern") return t("whichPattern");
    if (exercise.type === "mcq" && exercise.promptKey === "whichLine") return t("whichLine");
    if (exercise.type === "mcq" && exercise.promptKey === "whichSentence") {
      const gloss = support && exercise.promptI18n ? exercise.promptI18n[support] : "";
      return gloss ? `${t("whichSentence")} · ${gloss}` : t("whichSentence");
    }
    if (exercise.type === "mcq" && exercise.promptKey === "whichFits") {
      return `${t("whichFits")}${exercise.prompt ? ` · ${exercise.prompt}` : ""}`;
    }
    if (exercise.type === "order") {
      if (isI18nText(exercise.prompt)) {
        return support ? `${t("arrange")} · ${exercise.prompt[support]}` : t("arrange");
      }
      return exercise.prompt || t("arrange");
    }
    return exercise.prompt;
  }

  return (
    <article className="glass-tile pebble-a mx-auto max-w-3xl overflow-hidden p-0">
      <div className="px-6 py-6 sm:px-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
          {targetName} · {lesson.level} · {lesson.minutes} {t("minutes")}
        </p>
        <h1 className="font-display mt-2 text-3xl text-sky-700">{lesson.title[lesson.track]}</h1>
        {support ? <p className="mt-1 text-sm text-ink-soft">{lesson.title[support]}</p> : null}
        <p className="mt-3 leading-7 text-ink-soft">{support ? lesson.goal[support] : lesson.goal[lesson.track]}</p>
        <p className="mt-3 text-sm font-medium text-sky-700">{t("oneTrack", { name: targetName })}</p>
        <ol className="mt-5 flex flex-wrap gap-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase">
          {steps.map((item, index) => (
            <li
              key={item}
              className={`rounded-full px-3 py-1 ${
                index === step ? "bg-sky-700 text-white" : "bg-sky-100 text-sky-700"
              }`}
            >
              {t(item)}
            </li>
          ))}
        </ol>
      </div>

      {current === "theory" ? (
        <div className="grid gap-3 px-6 pb-6 sm:px-8">
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">
            {lesson.theory.levelTitle}
          </p>
          <p className="leading-7 text-ink">{lesson.theory.levelNote}</p>
          <ul className="grid gap-2">
            {lesson.theory.points.map((point) => (
              <li key={point} className="control-tile min-h-0 text-sm leading-6">
                {point}
              </li>
            ))}
          </ul>
          <div className="control-tile min-h-0">
            <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("structure")}</p>
            <p className="mt-2 leading-7">{lesson.theory.structure}</p>
          </div>
          {lesson.theory.patterns.map((pattern) => (
            <div key={`${pattern.form}-${pattern.example}`} className="control-tile min-h-0">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("pattern")}</p>
              <button type="button" className="mt-2 text-left" onClick={() => speak(pattern.example, lesson.speechLang)}>
                <span className="block text-lg font-semibold">{pattern.form}</span>
                <span className="mt-1 block text-sm text-ink-soft">{pattern.use}</span>
                <span className="mt-2 block leading-7">{pattern.example}</span>
                {pattern.note ? <span className="mt-1 block text-sm text-sky-700">{pattern.note}</span> : null}
              </button>
            </div>
          ))}
          {lesson.theory.contrasts?.length ? (
            <div className="control-tile min-h-0">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("contrasts")}</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6">
                {lesson.theory.contrasts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {lesson.theory.mistakes?.length ? (
            <div className="control-tile min-h-0">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("mistakes")}</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6">
                {lesson.theory.mistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {lesson.theory.examples?.length ? (
            <div className="control-tile min-h-0">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("examples")}</p>
              <ul className="mt-2 grid gap-2">
                {lesson.theory.examples.map((item) => (
                  <li key={item}>
                    <button type="button" className="text-left leading-7" onClick={() => speak(item, lesson.speechLang)}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {lesson.theory.table?.rows?.length ? (
            <div className="control-tile min-h-0">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{lesson.theory.table.title}</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6">
                {lesson.theory.table.rows.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {current === "words" ? (
        <ul className="grid gap-2 px-6 pb-6 sm:grid-cols-2 sm:px-8">
          {lesson.vocab.map((item, index) => (
            <li key={`${item.word}-${index}`} className="control-tile min-h-0">
              <button type="button" className="text-left" onClick={() => speak(item.word, lesson.speechLang)}>
                <span className="text-lg font-semibold text-ink">{item.word}</span>
                {item.reading ? <span className="mt-1 block text-sm text-sky-700">{item.reading}</span> : null}
                {support ? <span className="mt-1 block text-sm text-ink-soft">{item.meaning[support]}</span> : null}
                {item.usage ? (
                  <span className="mt-2 block text-sm leading-6 text-sky-700">
                    {t("howUsed")}: {item.usage}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {current === "usage" ? (
        <ul className="grid gap-3 px-6 pb-6 sm:px-8">
          {lesson.theory.usage.map((item) => (
            <li key={item} className="control-tile min-h-0 leading-7">
              {item}
            </li>
          ))}
          {lesson.theory.tip ? (
            <li className="control-tile min-h-0 text-sm leading-6 text-sky-700">
              {t("tip")}: {lesson.theory.tip}
            </li>
          ) : null}
        </ul>
      ) : null}

      {current === "lines" ? (
        <ul className="grid gap-3 px-6 pb-6 sm:px-8">
          {lesson.sentences.map((item, index) => (
            <li key={`${item.text}-${index}`} className="control-tile min-h-0">
              <button type="button" className="text-left" onClick={() => speak(item.text, lesson.speechLang)}>
                <span className="text-lg font-semibold leading-7 text-ink">{item.text}</span>
                {item.reading ? <span className="mt-1 block text-sm text-sky-700">{item.reading}</span> : null}
                {support ? <span className="mt-2 block text-sm text-ink-soft">{item.meaning[support]}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {current === "apply" ? (
        <div className="grid gap-3 px-6 pb-6 sm:px-8">
          <p className="leading-7 text-ink-soft">{t("applyLead")}</p>
          {lesson.theory.apply.map((item) => (
            <div key={item.frame} className="control-tile min-h-0">
              <p className="font-semibold">{item.prompt}</p>
              <p className="mt-2 text-lg leading-7">{item.frame}</p>
              <button
                type="button"
                className="mt-3 text-left text-sm text-sky-700"
                onClick={() => speak(item.sample, lesson.speechLang)}
              >
                {t("sample")}: {item.sample}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {current === "listen" ? (
        <div className="px-6 pb-6 sm:px-8">
          <button type="button" className="btn-primary" onClick={() => speak(lesson.listening.text, lesson.speechLang)}>
            {t("play")}
          </button>
          <button type="button" className="btn-ghost mt-3 ml-3" onClick={() => setShowScript((value) => !value)}>
            {showScript ? t("hideTranscript") : t("showTranscript")}
          </button>
          {showScript ? (
            <ul className="mt-4 grid gap-2">
              {lesson.listening.lines.map((line, index) => (
                <li key={`${line}-${index}`} className="control-tile min-h-0">
                  <span className="text-sm font-semibold leading-6">{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-6 text-ink-soft">{t("listenFirst")}</p>
          )}
        </div>
      ) : null}

      {current === "quiz" ? (
        <div className="px-6 pb-6 sm:px-8">
          <ol className="grid gap-4">
            {quiz.map((exercise, index) => (
              <li key={exercise.id} className="control-tile min-h-0">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">
                  {index + 1}. {promptOf(exercise)}
                </p>
                <ExerciseField
                  exercise={exercise}
                  value={answers[exercise.id]}
                  disabled={checked}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [exercise.id]: value }))}
                />
              </li>
            ))}
          </ol>
          {checked ? (
            <p className="mt-4 font-semibold text-sky-700">
              {t("score", { ok: score.ok, total: score.total })}
            </p>
          ) : null}
          {!checked ? (
            <button type="button" className="btn-primary mt-5" onClick={() => setChecked(true)}>
              {t("check")}
            </button>
          ) : !done ? (
            <button type="button" className="btn-primary mt-5" onClick={finish}>
              {t("finish")}
            </button>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/learn/${lesson.track}`} className="btn-ghost">
                {t("backTrack")}
              </Link>
              {nextId ? (
                <Link href={`/learn/${lesson.track}/${nextId}`} className="btn-primary">
                  {t("next")}
                </Link>
              ) : (
                <Link href="/learn" className="btn-primary">
                  {t("allTracks")}
                </Link>
              )}
            </div>
          )}
        </div>
      ) : null}

      {current !== "quiz" ? (
        <div className="flex justify-between gap-3 px-6 pb-6 sm:px-8">
          <button
            type="button"
            className="btn-ghost"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
            {t("back")}
          </button>
          <button type="button" className="btn-primary" onClick={() => setStep((value) => value + 1)}>
            {t("continue")}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function ExerciseField({
  exercise,
  value,
  disabled,
  onChange,
}: {
  exercise: Exercise;
  value: string | string[] | undefined;
  disabled: boolean;
  onChange: (value: string | string[]) => void;
}) {
  if (exercise.type === "mcq") {
    return (
      <div className="mt-3 grid gap-2">
        {exercise.options.map((option) => {
          const selected = value === option;
          const right = disabled && option === exercise.answer;
          const wrong = disabled && selected && option !== exercise.answer;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                right ? "bg-sky-700 text-white" : wrong ? "bg-cream-200" : selected ? "bg-white" : "bg-white/40"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  if (exercise.type === "gap") {
    return (
      <input
        value={typeof value === "string" ? value : ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
      />
    );
  }

  const chosen = Array.isArray(value) ? value : [];
  return <OrderField tokens={exercise.tokens} chosen={chosen} disabled={disabled} onChange={onChange} />;
}

function OrderField({
  tokens,
  chosen,
  disabled,
  onChange,
}: {
  tokens: string[];
  chosen: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
}) {
  const leftover = [...tokens];
  for (const item of chosen) {
    const idx = leftover.indexOf(item);
    if (idx >= 0) leftover.splice(idx, 1);
  }

  return (
    <div className="mt-3">
      <div className="flex min-h-12 flex-wrap gap-2 rounded-2xl bg-white/50 p-3">
        {chosen.length ? (
          chosen.map((token, index) => (
            <button
              key={`${token}-${index}`}
              type="button"
              disabled={disabled}
              className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700"
              onClick={() => onChange(chosen.filter((_, i) => i !== index))}
            >
              {token}
            </button>
          ))
        ) : (
          <span className="text-sm text-ink-soft">…</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {leftover.map((token, index) => (
          <button
            key={`${token}-left-${index}`}
            type="button"
            disabled={disabled}
            className="rounded-full bg-white px-3 py-1 text-sm font-semibold"
            onClick={() => onChange([...chosen, token])}
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}
