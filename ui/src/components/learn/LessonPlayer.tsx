/** @format */

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Phonetic, SpeakButton, speakText } from "@/components/learn/LearnAudio";
import { MatchGame, QuoteBoard } from "@/components/learn/LearnGame";
import type { Exercise, I18nText, Lesson } from "@/lib/learn/types";

const shapes = ["pebble-a", "pebble-b", "pebble-c", "pebble-d"] as const;

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
  if (!support || lesson.vocab.length < 4 || lesson.kind === "play") return [];
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

  return extras.slice(0, 6);
}

function stepsFor(kind: Lesson["kind"]) {
  if (kind === "play") return ["quotes", "game", "quiz"] as const;
  if (kind === "practice") return ["apply", "quiz"] as const;
  if (kind === "listen") return ["listen", "quiz"] as const;
  if (kind === "words") return ["words", "quiz"] as const;
  if (kind === "teach") return ["theory", "quiz"] as const;
  if (kind === "drill") return ["theory", "quiz"] as const;
  if (kind === "review") return ["words", "lines", "quiz"] as const;
  return ["theory", "words", "lines", "apply", "quiz"] as const;
}

export function LessonPlayer({ lesson, locale, nextId }: { lesson: Lesson; locale: Locale; nextId?: string }) {
  const t = useTranslations("Learn");
  const steps = stepsFor(lesson.kind);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [slow, setSlow] = useState(false);

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

  function say(text: string) {
    speakText(text, lesson.speechLang, slow);
  }

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
    <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[12.5rem_minmax(0,1fr)]">
      <ol className="learn-steps relative z-[1]">
        {steps.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              className={`learn-step w-full ${index === step ? "is-active" : ""}`}
              onClick={() => setStep(index)}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/50 text-[0.68rem] font-semibold">
                {index + 1}
              </span>
              <span className="text-[0.68rem] font-semibold tracking-[0.12em] uppercase">{t(item)}</span>
            </button>
          </li>
        ))}
      </ol>

      <article className="glass-tile pebble-a relative overflow-hidden p-0">
        <div className="learn-blob -right-10 -top-8 h-28 w-28 rounded-[60%_40%_55%_45%] bg-sky-200/40" />
        <div className="learn-blob bottom-10 left-[-2rem] h-20 w-24 rounded-[45%_55%_40%_60%] bg-cream-200/60" />

        <div className="relative px-6 py-7 sm:px-9">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
            {targetName} · {lesson.level} · {lesson.minutes} {t("minutes")}
          </p>
          <h1 className="font-display mt-3 max-w-xl text-3xl leading-tight text-sky-700 sm:text-4xl">
            {lesson.title[lesson.track]}
          </h1>
          {support ? <p className="mt-2 text-sm text-ink-soft">{lesson.title[support]}</p> : null}
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">
            {support ? lesson.goal[support] : lesson.goal[lesson.track]}
          </p>
          <p className="mt-3 text-sm font-medium text-sky-700">{t("oneTrack", { name: targetName })}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={slow ? "btn-primary py-2" : "btn-ghost py-2"}
              onClick={() => setSlow((value) => !value)}
            >
              {slow ? t("slow") : t("normal")}
            </button>
          </div>
        </div>

        {current === "theory" ? (
          <div className="relative grid gap-4 px-6 pb-6 sm:px-9">
            <div className="glass-hud pebble-b p-5 sm:p-6">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">
                {lesson.theory.levelTitle}
              </p>
              <p className="mt-3 leading-7 text-ink">{lesson.theory.levelNote}</p>
            </div>
            <ul className="learn-chips grid gap-2 sm:grid-cols-2">
              {lesson.theory.points.map((point) => (
                <li key={point} className="control-tile min-h-0 text-sm leading-6">
                  {point}
                </li>
              ))}
            </ul>
            <div className="control-tile pebble-c min-h-0 sm:max-w-[92%]">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("structure")}</p>
              <p className="mt-2 leading-7">{lesson.theory.structure}</p>
            </div>
            <div className="learn-chips grid gap-3 sm:grid-cols-2">
              {lesson.theory.patterns.map((pattern) => (
                <div key={`${pattern.form}-${pattern.example}`} className="control-tile pebble-a min-h-0">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("pattern")}</p>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <button type="button" className="text-left" onClick={() => say(pattern.example)}>
                      <span className="block font-display text-lg font-semibold text-sky-700">{pattern.form}</span>
                      <span className="mt-1 block text-sm text-ink-soft">{pattern.use}</span>
                      <span className="mt-2 block leading-7">{pattern.example}</span>
                      {pattern.note ? <span className="mt-1 block text-sm text-sky-700">{pattern.note}</span> : null}
                    </button>
                    <SpeakButton text={pattern.example} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                  </div>
                </div>
              ))}
            </div>
            {lesson.theory.contrasts?.length ? (
              <div className="control-tile pebble-b min-h-0 sm:ml-6">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("contrasts")}</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6">
                  {lesson.theory.contrasts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lesson.theory.mistakes?.length ? (
              <div className="control-tile pebble-d min-h-0 sm:mr-8">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("mistakes")}</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6">
                  {lesson.theory.mistakes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lesson.theory.examples?.length ? (
              <div className="control-tile pebble-c min-h-0">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("examples")}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {lesson.theory.examples.map((item) => (
                    <li key={item} className="flex items-start justify-between gap-3">
                      <button type="button" className="text-left leading-7" onClick={() => say(item)}>
                        {item}
                      </button>
                      <SpeakButton text={item} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lesson.theory.table?.rows?.length ? (
              <div className="control-tile pebble-a min-h-0 sm:max-w-[94%]">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">
                  {lesson.theory.table.title}
                </p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 sm:grid-cols-2">
                  {lesson.theory.table.rows.map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lesson.theory.usage?.length ? (
              <div className="control-tile pebble-b min-h-0">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("usage")}</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6">
                  {lesson.theory.usage.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lesson.theory.tip ? (
              <div className="control-tile pebble-c min-h-0 text-sm leading-6 text-sky-700">
                {t("tip")}: {lesson.theory.tip}
              </div>
            ) : null}
          </div>
        ) : null}

        {current === "words" ? (
          <ul className="relative grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-9">
            {lesson.vocab.map((item, index) => (
              <li key={`${item.word}-${index}`} className={`control-tile min-h-0 ${shapes[index % 4]}`}>
                <div className="flex items-start justify-between gap-2">
                  <button type="button" className="text-left" onClick={() => say(item.word)}>
                    <span className="font-display text-xl font-semibold text-sky-700">{item.word}</span>
                    <Phonetic
                      reading={item.reading}
                      sayVi={item.sayVi}
                      locale={locale}
                      phoneticLabel={t("phonetic")}
                      sayViLabel={t("sayViLabel")}
                    />
                    {support ? <span className="mt-1 block text-sm text-ink-soft">{item.meaning[support]}</span> : null}
                    {item.usage ? (
                      <span className="mt-2 block text-sm leading-6 text-sky-700">
                        {t("howUsed")}: {item.usage}
                      </span>
                    ) : null}
                  </button>
                  <SpeakButton text={item.word} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {current === "lines" ? (
          <ul className="learn-stack relative grid gap-3 px-6 pb-6 sm:px-9">
            {lesson.sentences.map((item, index) => (
              <li key={`${item.text}-${index}`} className={`control-tile min-h-0 ${shapes[index % 4]}`}>
                <div className="flex items-start justify-between gap-2">
                  <button type="button" className="text-left" onClick={() => say(item.text)}>
                    <span className="font-display text-lg font-semibold leading-7 text-sky-700">{item.text}</span>
                    <Phonetic
                      reading={item.reading}
                      sayVi={item.sayVi}
                      locale={locale}
                      phoneticLabel={t("phonetic")}
                      sayViLabel={t("sayViLabel")}
                    />
                    {support ? <span className="mt-2 block text-sm text-ink-soft">{item.meaning[support]}</span> : null}
                  </button>
                  <SpeakButton text={item.text} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {current === "apply" ? (
          <div className="learn-stack relative grid gap-3 px-6 pb-6 sm:px-9">
            <p className="leading-7 text-ink-soft">{t("applyLead")}</p>
            {lesson.theory.apply.map((item) => (
              <div key={item.frame} className="control-tile pebble-a min-h-0">
                <p className="font-semibold">{item.prompt}</p>
                <p className="mt-2 font-display text-lg leading-7 text-sky-700">{item.frame}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button type="button" className="text-left text-sm text-sky-700" onClick={() => say(item.sample)}>
                    {t("sample")}: {item.sample}
                  </button>
                  <SpeakButton text={item.sample} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {current === "listen" ? (
          <div className="relative px-6 pb-6 sm:px-9">
            <div className="glass-hud pebble-c flex flex-wrap items-center gap-3 p-5">
              <button type="button" className="btn-primary" onClick={() => say(lesson.listening.text)}>
                {t("playAudio")}
              </button>
              <SpeakButton text={lesson.listening.text} lang={lesson.speechLang} slow={slow} label={t("hear")} />
              <button type="button" className="btn-ghost" onClick={() => setShowScript((value) => !value)}>
                {showScript ? t("hideTranscript") : t("showTranscript")}
              </button>
            </div>
            {showScript ? (
              <ul className="learn-stack mt-4 grid gap-2">
                {lesson.listening.lines.map((line, index) => {
                  const item = lesson.sentences.find((row) => row.text === line);
                  return (
                    <li key={`${line}-${index}`} className="control-tile min-h-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          className="text-left text-sm font-semibold leading-6"
                          onClick={() => say(line)}
                        >
                          {line}
                        </button>
                        <SpeakButton text={line} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                      </div>
                      {item ? (
                        <Phonetic
                          reading={item.reading}
                          sayVi={item.sayVi}
                          locale={locale}
                          phoneticLabel={t("phonetic")}
                          sayViLabel={t("sayViLabel")}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-ink-soft">{t("listenFirst")}</p>
            )}
          </div>
        ) : null}

        {current === "quotes" ? (
          <div className="relative px-6 pb-6 sm:px-9">
            <p className="mb-4 text-sm leading-6 text-ink-soft">{t("quotesLead")}</p>
            <QuoteBoard
              quotes={lesson.quotes?.length ? lesson.quotes : lesson.sentences.slice(0, 6)}
              lang={lesson.speechLang}
              locale={locale}
              slow={slow}
              hearLabel={t("hear")}
              phoneticLabel={t("phonetic")}
              sayViLabel={t("sayViLabel")}
            />
          </div>
        ) : null}

        {current === "game" ? (
          <div className="relative px-6 pb-6 sm:px-9">
            <p className="mb-4 text-sm leading-6 text-ink-soft">{t("matchLead")}</p>
            <MatchGame
              vocab={lesson.vocab.slice(0, 6)}
              locale={locale}
              support={support}
              matchedLabel={t("matched")}
              doneLabel={t("matchDone")}
            />
          </div>
        ) : null}

        {current === "quiz" ? (
          <div className="relative px-6 pb-6 sm:px-9">
            <ol className="learn-stack grid gap-4">
              {quiz.map((exercise, index) => (
                <li key={exercise.id} className={`control-tile min-h-0 ${shapes[index % 4]}`}>
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
              <p className="mt-4 font-semibold text-sky-700">{t("score", { ok: score.ok, total: score.total })}</p>
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
          <div className="relative flex justify-between gap-3 px-6 pb-7 sm:px-9">
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
    </div>
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
              className={`pebble-a px-4 py-3 text-left text-sm font-semibold ${
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
