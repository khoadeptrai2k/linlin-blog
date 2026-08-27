"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Phonetic, SpeakButton, speakText } from "@/components/learn/LearnAudio";
import { MatchGame } from "@/components/learn/LearnGame";
import type { Exercise, GrammarPattern, I18nText, Lesson, LessonTheory } from "@/lib/learn/types";

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
): Exercise[] {
  if (!support || lesson.vocab.length < 4 || lesson.kind === "play") return [];
  const extras: Exercise[] = [];
  const glosses = lesson.vocab.map((item) => item.meaning[support]);

  lesson.vocab.slice(0, 3).forEach((item, index) => {
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

  return extras;
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

type TheorySlide =
  | { type: "intro" }
  | { type: "points"; items: string[] }
  | { type: "structure" }
  | { type: "pattern"; pattern: GrammarPattern }
  | { type: "list"; titleKey: "contrasts" | "mistakes" | "usage" | "examples"; items: string[] }
  | { type: "table" }
  | { type: "tip" };

function theorySlides(theory: LessonTheory): TheorySlide[] {
  const slides: TheorySlide[] = [{ type: "intro" }];
  for (let i = 0; i < theory.points.length; i += 3) {
    slides.push({ type: "points", items: theory.points.slice(i, i + 3) });
  }
  if (theory.structure) slides.push({ type: "structure" });
  theory.patterns.forEach((pattern) => slides.push({ type: "pattern", pattern }));
  if (theory.contrasts?.length) slides.push({ type: "list", titleKey: "contrasts", items: theory.contrasts });
  if (theory.mistakes?.length) slides.push({ type: "list", titleKey: "mistakes", items: theory.mistakes });
  for (let i = 0; i < (theory.examples?.length ?? 0); i += 2) {
    slides.push({ type: "list", titleKey: "examples", items: theory.examples.slice(i, i + 2) });
  }
  if (theory.usage?.length) slides.push({ type: "list", titleKey: "usage", items: theory.usage });
  if (theory.table?.rows?.length) slides.push({ type: "table" });
  if (theory.tip) slides.push({ type: "tip" });
  return slides;
}

function chunkCount(current: string, lesson: Lesson, slides: TheorySlide[], quizLen: number) {
  if (current === "theory") return Math.max(1, slides.length);
  if (current === "words") return Math.max(1, lesson.vocab.length);
  if (current === "lines") return Math.max(1, lesson.sentences.length);
  if (current === "apply") return Math.max(1, lesson.theory.apply.length);
  if (current === "quotes") return Math.max(1, (lesson.quotes?.length ? lesson.quotes : lesson.sentences).slice(0, 6).length);
  if (current === "quiz") return Math.max(1, quizLen);
  return 1;
}

export function LessonPlayer({ lesson, locale, nextId }: { lesson: Lesson; locale: Locale; nextId?: string }) {
  const t = useTranslations("Learn");
  const steps = stepsFor(lesson.kind);
  const [step, setStep] = useState(0);
  const [item, setItem] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [slow, setSlow] = useState(false);

  const support = supportLocale(lesson.track, locale);
  const current = steps[step];
  const targetName = localeMeta[lesson.track].native;
  const slides = useMemo(() => theorySlides(lesson.theory), [lesson.theory]);
  const quotes = (lesson.quotes?.length ? lesson.quotes : lesson.sentences).slice(0, 6);

  const quiz = useMemo(
    () =>
      [
        ...lesson.exercises,
        ...extraExercises(lesson, support, (word) => t("whatMeans", { word })),
      ].slice(0, 8),
    [lesson, support, t],
  );

  const totalItems = chunkCount(current, lesson, slides, quiz.length);
  const index = Math.min(item, totalItems - 1);

  function resetInner() {
    setItem(0);
    setChecked(false);
    setShowScript(false);
  }

  function changeStep(next: number) {
    setStep(next);
    resetInner();
  }

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

  function goBack() {
    if (index > 0) {
      setItem(index - 1);
      setChecked(false);
      return;
    }
    if (step > 0) changeStep(step - 1);
  }

  function goNext() {
    if (current === "quiz") {
      if (!checked) {
        setChecked(true);
        return;
      }
      if (index < totalItems - 1) {
        setItem(index + 1);
        setChecked(false);
        return;
      }
      if (!done) {
        finish();
        return;
      }
      return;
    }
    if (index < totalItems - 1) {
      setItem(index + 1);
      return;
    }
    if (step < steps.length - 1) changeStep(step + 1);
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

  const quizDone = current === "quiz" && checked && index === totalItems - 1 && done;
  const nextLabel =
    current === "quiz" && !checked
      ? t("check")
      : current === "quiz" && index < totalItems - 1
        ? t("nextItem")
        : current === "quiz" && !done
          ? t("finish")
          : index < totalItems - 1
            ? t("nextItem")
            : t("continue");

  const slide = slides[index];
  const word = lesson.vocab[index];
  const line = lesson.sentences[index];
  const apply = lesson.theory.apply[index];
  const quote = quotes[index];
  const exercise = quiz[index];

  return (
    <div className="learn-desk mx-auto max-w-xl">
      <div className="mb-4 flex gap-1.5">
        {steps.map((itemStep, i) => (
          <button
            key={itemStep}
            type="button"
            className={`learn-dot ${i === step ? "is-active" : i < step ? "is-done" : ""}`}
            onClick={() => changeStep(i)}
            aria-label={t(itemStep)}
          />
        ))}
      </div>

      <article className="glass-tile p-0">
        <div className="px-5 py-5 sm:px-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
            {targetName} · {t(current)} · {t("ofItems", { n: index + 1, total: totalItems })}
          </p>
          <h1 className="font-display mt-2 text-2xl leading-tight text-sky-700 sm:text-3xl">
            {lesson.title[lesson.track]}
          </h1>
          {support ? <p className="mt-1 text-sm text-ink-soft">{lesson.title[support]}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={slow ? "btn-primary py-2" : "btn-ghost py-2"} onClick={() => setSlow((v) => !v)}>
              {slow ? t("slow") : t("normal")}
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-7">
          {current === "theory" && slide ? (
            <TheorySlideView
              slide={slide}
              theory={lesson.theory}
              t={t}
              slow={slow}
              lang={lesson.speechLang}
              onSay={say}
            />
          ) : null}

          {current === "words" && word ? (
            <FocusCard
              title={word.word}
              reading={word.reading}
              sayVi={word.sayVi}
              meaning={support ? word.meaning[support] : undefined}
              note={word.usage ? `${t("howUsed")}: ${word.usage}` : undefined}
              locale={locale}
              t={t}
              onSay={() => say(word.word)}
              lang={lesson.speechLang}
              slow={slow}
            />
          ) : null}

          {current === "lines" && line ? (
            <FocusCard
              title={line.text}
              reading={line.reading}
              sayVi={line.sayVi}
              meaning={support ? line.meaning[support] : undefined}
              locale={locale}
              t={t}
              onSay={() => say(line.text)}
              lang={lesson.speechLang}
              slow={slow}
            />
          ) : null}

          {current === "apply" && apply ? (
            <div className="control-tile min-h-0">
              <p className="text-sm text-ink-soft">{t("applyLead")}</p>
              <p className="mt-3 font-semibold">{apply.prompt}</p>
              <p className="font-display mt-2 text-xl leading-7 text-sky-700">{apply.frame}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <button type="button" className="text-left text-sm text-sky-700" onClick={() => say(apply.sample)}>
                  {t("sample")}: {apply.sample}
                </button>
                <SpeakButton text={apply.sample} lang={lesson.speechLang} slow={slow} label={t("hear")} />
              </div>
            </div>
          ) : null}

          {current === "listen" ? (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn-primary" onClick={() => say(lesson.listening.text)}>
                  {t("playAudio")}
                </button>
                <SpeakButton text={lesson.listening.text} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                <button type="button" className="btn-ghost" onClick={() => setShowScript((v) => !v)}>
                  {showScript ? t("hideTranscript") : t("showTranscript")}
                </button>
              </div>
              {showScript ? (
                <ul className="mt-4 grid gap-2">
                  {lesson.listening.lines.slice(0, 4).map((textLine) => (
                    <li key={textLine} className="flex items-start justify-between gap-2 text-sm leading-6">
                      <button type="button" className="text-left font-semibold" onClick={() => say(textLine)}>
                        {textLine}
                      </button>
                      <SpeakButton text={textLine} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-ink-soft">{t("listenFirst")}</p>
              )}
            </div>
          ) : null}

          {current === "quotes" && quote ? (
            <FocusCard
              title={quote.text}
              reading={quote.reading}
              sayVi={quote.sayVi}
              meaning={support ? quote.meaning[support] : undefined}
              locale={locale}
              t={t}
              onSay={() => say(quote.text)}
              lang={lesson.speechLang}
              slow={slow}
              lead={t("quotesLead")}
            />
          ) : null}

          {current === "game" ? (
            <div>
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

          {current === "quiz" && exercise ? (
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">
                {t("questionOf", { n: index + 1, total: quiz.length })}
              </p>
              <p className="mt-2 font-semibold leading-7">{promptOf(exercise)}</p>
              <ExerciseField
                exercise={exercise}
                value={answers[exercise.id]}
                disabled={checked}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [exercise.id]: value }))}
              />
              {checked && index === totalItems - 1 ? (
                <p className="mt-3 text-sm font-semibold text-sky-700">
                  {t("score", { ok: score.ok, total: score.total })}
                </p>
              ) : null}
            </div>
          ) : null}

          {quizDone ? (
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
          ) : (
            <div className="mt-6 flex justify-between gap-3">
              <button type="button" className="btn-ghost" disabled={step === 0 && index === 0} onClick={goBack}>
                {t("back")}
              </button>
              <button type="button" className="btn-primary" onClick={goNext}>
                {nextLabel}
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function FocusCard({
  title,
  reading,
  sayVi,
  meaning,
  note,
  lead,
  locale,
  t,
  onSay,
  lang,
  slow,
}: {
  title: string;
  reading?: string;
  sayVi?: string;
  meaning?: string;
  note?: string;
  lead?: string;
  locale: Locale;
  t: ReturnType<typeof useTranslations<"Learn">>;
  onSay: () => void;
  lang: string;
  slow: boolean;
}) {
  return (
    <div>
      {lead ? <p className="mb-3 text-sm leading-6 text-ink-soft">{lead}</p> : null}
      <div className="control-tile min-h-0">
        <div className="flex items-start justify-between gap-3">
          <button type="button" className="text-left" onClick={onSay}>
            <span className="font-display text-2xl font-semibold leading-snug text-sky-700">{title}</span>
          </button>
          <SpeakButton text={title} lang={lang} slow={slow} label={t("hear")} />
        </div>
        <Phonetic
          reading={reading}
          sayVi={sayVi}
          locale={locale}
          phoneticLabel={t("phonetic")}
          sayViLabel={t("sayViLabel")}
        />
        {meaning ? <p className="mt-2 text-sm text-ink-soft">{meaning}</p> : null}
        {note ? <p className="mt-2 text-sm text-sky-700">{note}</p> : null}
      </div>
    </div>
  );
}

function TheorySlideView({
  slide,
  theory,
  t,
  slow,
  lang,
  onSay,
}: {
  slide: TheorySlide;
  theory: LessonTheory;
  t: ReturnType<typeof useTranslations<"Learn">>;
  slow: boolean;
  lang: string;
  onSay: (text: string) => void;
}) {
  if (slide.type === "intro") {
    return (
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">{theory.levelTitle}</p>
        <p className="mt-3 leading-7">{theory.levelNote}</p>
      </div>
    );
  }
  if (slide.type === "points") {
    return (
      <ul className="grid gap-2">
        {slide.items.map((point) => (
          <li key={point} className="control-tile min-h-0 text-sm leading-6">
            {point}
          </li>
        ))}
      </ul>
    );
  }
  if (slide.type === "structure") {
    return (
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("structure")}</p>
        <p className="mt-2 leading-7">{theory.structure}</p>
      </div>
    );
  }
  if (slide.type === "pattern") {
    const pattern = slide.pattern;
    return (
      <div className="control-tile min-h-0">
        <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t("pattern")}</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <button type="button" className="text-left" onClick={() => onSay(pattern.example)}>
            <span className="block font-display text-lg font-semibold text-sky-700">{pattern.form}</span>
            <span className="mt-1 block text-sm text-ink-soft">{pattern.use}</span>
            <span className="mt-2 block leading-7">{pattern.example}</span>
            {pattern.note ? <span className="mt-1 block text-sm text-sky-700">{pattern.note}</span> : null}
          </button>
          <SpeakButton text={pattern.example} lang={lang} slow={slow} label={t("hear")} />
        </div>
      </div>
    );
  }
  if (slide.type === "list") {
    return (
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{t(slide.titleKey)}</p>
        <ul className="mt-2 grid gap-2">
          {slide.items.map((row) => (
            <li key={row} className="flex items-start justify-between gap-3 leading-7">
              <button type="button" className="text-left" onClick={() => onSay(row)}>
                {row}
              </button>
              <SpeakButton text={row} lang={lang} slow={slow} label={t("hear")} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (slide.type === "table") {
    return (
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-70">{theory.table.title}</p>
        <ul className="mt-2 grid gap-2 text-sm leading-6">
          {theory.table.rows.slice(0, 6).map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <p className="leading-7 text-sky-700">
      {t("tip")}: {theory.tip}
    </p>
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
  const leftover = [...exercise.tokens];
  for (const token of chosen) {
    const idx = leftover.indexOf(token);
    if (idx >= 0) leftover.splice(idx, 1);
  }

  return (
    <div className="mt-3">
      <div className="flex min-h-12 flex-wrap gap-2 rounded-2xl bg-white/50 p-3">
        {chosen.length ? (
          chosen.map((token, i) => (
            <button
              key={`${token}-${i}`}
              type="button"
              disabled={disabled}
              className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700"
              onClick={() => onChange(chosen.filter((_, j) => j !== i))}
            >
              {token}
            </button>
          ))
        ) : (
          <span className="text-sm text-ink-soft">…</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {leftover.map((token, i) => (
          <button
            key={`${token}-left-${i}`}
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
