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

function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
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

function makeMcq(id: string, prompt: string, answer: string, pool: string[], seed: string): Exercise | null {
  const distractors = pick(pool, 3, answer, seed);
  if (!answer || distractors.length < 2) return null;
  return {
    id,
    type: "mcq",
    prompt,
    options: seededShuffle([answer, ...distractors].slice(0, 4), `${seed}-opt`),
    answer,
  };
}

function extraExercises(
  lesson: Lesson,
  support: Locale | null,
  whatMeans: (word: string) => string,
): Exercise[] {
  if (!support || lesson.vocab.length < 4 || lesson.kind === "play") return [];
  const glosses = lesson.vocab.map((item) => item.meaning[support]);
  const extras: Exercise[] = [];
  lesson.vocab.slice(0, 3).forEach((item, index) => {
    const drill = makeMcq(
      `${lesson.id}-rt-mean-${index}`,
      whatMeans(item.word),
      item.meaning[support],
      glosses,
      `${lesson.id}-mean-${index}`,
    );
    if (drill) extras.push(drill);
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

function isRight(exercise: Exercise, given: string | string[] | undefined) {
  if (exercise.type === "order") return Array.isArray(given) && sameTokens(given, exercise.answer);
  return typeof given === "string" && norm(given) === norm(exercise.answer);
}

function hasAnswer(exercise: Exercise, given: string | string[] | undefined) {
  if (exercise.type === "order") return Array.isArray(given) && given.length > 0;
  return typeof given === "string" && given.trim().length > 0;
}

function drillFor(
  current: string,
  lesson: Lesson,
  index: number,
  support: Locale | null,
  t: ReturnType<typeof useTranslations<"Learn">>,
  quiz: Exercise[],
): Exercise | null {
  if (current === "quiz") return quiz[index] ?? null;
  if (current === "words") {
    const word = lesson.vocab[index];
    if (!word) return null;
    const words = lesson.vocab.map((item) => item.word);
    if (support && index % 2 === 0) {
      return makeMcq(
        `${lesson.id}-word-mean-${index}`,
        t("whatMeans", { word: word.word }),
        word.meaning[support],
        lesson.vocab.map((item) => item.meaning[support]),
        `${lesson.id}-wm-${index}`,
      );
    }
    const pickWord = makeMcq(
      `${lesson.id}-word-pick-${index}`,
      support ? t("whichWord", { gloss: word.meaning[support] }) : t("typeThis"),
      word.word,
      words,
      `${lesson.id}-wp-${index}`,
    );
    if (pickWord) return pickWord;
    return {
      id: `${lesson.id}-word-type-${index}`,
      type: "gap",
      prompt: support ? word.meaning[support] : word.reading || word.sayVi || t("typeThis"),
      answer: word.word,
    };
  }
  if (current === "lines" || current === "quotes") {
    const rows = current === "quotes" ? (lesson.quotes?.length ? lesson.quotes : lesson.sentences).slice(0, 6) : lesson.sentences;
    const row = rows[index];
    if (!row) return null;
    const texts = rows.map((item) => item.text);
    const meaning = "meaning" in row ? row.meaning : undefined;
    const prompt = support && meaning ? `${t("whichSentence")} · ${meaning[support]}` : t("whichSentence");
    const choice = makeMcq(`${lesson.id}-${current}-pick-${index}`, prompt, row.text, texts, `${lesson.id}-${current}-${index}`);
    if (choice) return choice;
    const rawTokens = "tokens" in row && Array.isArray(row.tokens) ? row.tokens.filter((item): item is string => typeof item === "string") : [];
    const tokens = rawTokens.length >= 2 ? rawTokens : row.text.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      return {
        id: `${lesson.id}-${current}-ord-${index}`,
        type: "order",
        prompt,
        tokens: seededShuffle(tokens, `${lesson.id}-${current}-ord-${index}`),
        answer: tokens,
      };
    }
    return { id: `${lesson.id}-${current}-gap-${index}`, type: "gap", prompt: t("typeThis"), answer: row.text };
  }
  if (current === "apply") {
    const item = lesson.theory.apply[index];
    if (!item) return null;
    const samples = lesson.theory.apply.map((row) => row.sample);
    const choice = makeMcq(
      `${lesson.id}-apply-${index}`,
      item.prompt,
      item.sample,
      samples,
      `${lesson.id}-ap-${index}`,
    );
    if (choice) return choice;
    return { id: `${lesson.id}-apply-gap-${index}`, type: "gap", prompt: item.frame, answer: item.sample };
  }
  if (current === "listen") {
    const lines = lesson.listening.lines.filter(Boolean);
    return makeMcq(`${lesson.id}-listen-pick`, t("whichLine"), lines[0], lines, `${lesson.id}-listen`);
  }
  return null;
}

export function LessonPlayer({ lesson, locale, nextId }: { lesson: Lesson; locale: Locale; nextId?: string }) {
  const t = useTranslations("Learn");
  const steps = stepsFor(lesson.kind);
  const [step, setStep] = useState(0);
  const [item, setItem] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [passed, setPassed] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [slow, setSlow] = useState(false);

  const support = supportLocale(lesson.track, locale);
  const current = steps[step];
  const targetName = localeMeta[lesson.track].native;
  const slides = useMemo(() => theorySlides(lesson.theory), [lesson.theory]);
  const quotes = (lesson.quotes?.length ? lesson.quotes : lesson.sentences).slice(0, 6);

  const quiz = useMemo(
    () => [...lesson.exercises, ...extraExercises(lesson, support, (word) => t("whatMeans", { word }))].slice(0, 8),
    [lesson, support, t],
  );

  const totalItems = (() => {
    if (current === "theory") return Math.max(1, slides.length);
    if (current === "words") return Math.max(1, lesson.vocab.length);
    if (current === "lines") return Math.max(1, lesson.sentences.length);
    if (current === "apply") return Math.max(1, lesson.theory.apply.length);
    if (current === "quotes") return Math.max(1, quotes.length);
    if (current === "quiz") return Math.max(1, quiz.length);
    return 1;
  })();
  const index = Math.min(item, totalItems - 1);
  const drill = drillFor(current, lesson, index, support, t, quiz);
  const given = drill ? answers[drill.id] : undefined;
  const checked = drill ? Boolean(checkedMap[drill.id]) : false;
  const correct = drill ? isRight(drill, given) : true;

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

  function railLabel(stepName: string, i: number) {
    if (stepName === "words") return lesson.vocab[i]?.word ?? `${i + 1}`;
    if (stepName === "lines") return lesson.sentences[i]?.text ?? `${i + 1}`;
    if (stepName === "quotes") return quotes[i]?.text ?? `${i + 1}`;
    if (stepName === "apply") return lesson.theory.apply[i]?.prompt ?? `${i + 1}`;
    if (stepName === "quiz") return `${i + 1}`;
    if (stepName === "theory") return String(i + 1);
    if (stepName === "listen") return t("listen");
    if (stepName === "game") return t("game");
    return String(i + 1);
  }

  function countFor(stepName: string) {
    if (stepName === "theory") return Math.max(1, slides.length);
    if (stepName === "words") return Math.max(1, lesson.vocab.length);
    if (stepName === "lines") return Math.max(1, lesson.sentences.length);
    if (stepName === "apply") return Math.max(1, lesson.theory.apply.length);
    if (stepName === "quotes") return Math.max(1, quotes.length);
    if (stepName === "quiz") return Math.max(1, quiz.length);
    return 1;
  }

  function keyOf(stepIndex: number, i: number) {
    return `${steps[stepIndex]}:${i}`;
  }

  function say(text: string) {
    speakText(text, lesson.speechLang, slow);
  }

  function finish() {
    saveDone(lesson.track, lesson.id);
    setDone(true);
  }

  function goTo(nextStep: number, nextItem: number) {
    setStep(nextStep);
    setItem(nextItem);
    setShowScript(false);
  }

  function checkNow() {
    if (!drill || !hasAnswer(drill, given)) return;
    setCheckedMap((prev) => ({ ...prev, [drill.id]: true }));
    if (isRight(drill, given)) setPassed((prev) => ({ ...prev, [keyOf(step, index)]: true }));
  }

  function goNext() {
    if (drill && !checked) return;
    if (drill && checked) setPassed((prev) => ({ ...prev, [keyOf(step, index)]: true }));
    if (index < totalItems - 1) {
      setItem(index + 1);
      return;
    }
    if (step < steps.length - 1) {
      goTo(step + 1, 0);
      return;
    }
    if (!done) finish();
  }

  function goBack() {
    if (index > 0) {
      setItem(index - 1);
      return;
    }
    if (step > 0) goTo(step - 1, countFor(steps[step - 1]) - 1);
  }

  const quizDone = current === "quiz" && done;
  const canCheck = Boolean(drill && !checked && hasAnswer(drill, given));
  const canNext = !drill || checked;
  const word = lesson.vocab[index];
  const line = lesson.sentences[index];
  const apply = lesson.theory.apply[index];
  const quote = quotes[index];
  const slide = slides[index];
  const reveal = !drill || checked;

  const score = useMemo(() => {
    let ok = 0;
    for (const exercise of quiz) {
      if (isRight(exercise, answers[exercise.id])) ok += 1;
    }
    return { ok, total: quiz.length };
  }, [answers, quiz]);

  return (
    <div className="learn-desk mx-auto grid max-w-5xl gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="learn-rail">
        <p className="px-1 text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">{t("learnedList")}</p>
        <ol className="mt-3 grid gap-4">
          {steps.map((stepName, stepIndex) => (
            <li key={stepName}>
              <p className="text-xs font-semibold tracking-[0.12em] text-sky-700 uppercase">{t(stepName)}</p>
              <ul className="mt-1.5 grid gap-1">
                {Array.from({ length: countFor(stepName) }, (_, i) => {
                  const key = keyOf(stepIndex, i);
                  const here = stepIndex === step && i === index;
                  const learned = Boolean(passed[key]);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className={`learn-rail-item ${here ? "is-active" : ""} ${learned ? "is-done" : ""}`}
                        onClick={() => goTo(stepIndex, i)}
                      >
                        <span className="learn-rail-mark">{learned ? "✓" : here ? "•" : i + 1}</span>
                        <span className="truncate">{railLabel(stepName, i)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </aside>

      <article className="learn-card glass-tile min-w-0 p-0">
        <div className="shrink-0 px-5 py-4 sm:px-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
            {targetName} · {t(current)} · {t("ofItems", { n: index + 1, total: totalItems })}
          </p>
          <h1 className="font-display mt-2 text-2xl leading-tight text-sky-700 sm:text-3xl">
            {lesson.title[lesson.track]}
          </h1>
          {support ? <p className="mt-1 text-sm text-ink-soft">{lesson.title[support]}</p> : null}
          <button
            type="button"
            className={slow ? "btn-primary mt-3 py-2" : "btn-ghost mt-3 py-2"}
            onClick={() => setSlow((value) => !value)}
          >
            {slow ? t("slow") : t("normal")}
          </button>
        </div>

        <div className="learn-stage min-h-0 flex-1 overflow-auto px-5 pb-4 sm:px-7">
          {current === "theory" && slide ? (
            <TheorySlideView slide={slide} theory={lesson.theory} t={t} slow={slow} lang={lesson.speechLang} onSay={say} />
          ) : null}

          {current === "words" && word ? (
            <FocusCard
              title={word.word}
              speak={word.word}
              reading={word.reading}
              sayVi={word.sayVi}
              meaning={reveal && support ? word.meaning[support] : undefined}
              note={reveal && word.usage ? `${t("howUsed")}: ${word.usage}` : undefined}
              hideText={!reveal && Boolean(drill && drill.type === "mcq" && drill.answer === word.word)}
              locale={locale}
              t={t}
              lang={lesson.speechLang}
              slow={slow}
            />
          ) : null}

          {current === "lines" && line ? (
            <FocusCard
              title={reveal ? line.text : "……"}
              speak={line.text}
              reading={reveal ? line.reading : undefined}
              sayVi={reveal ? line.sayVi : undefined}
              locale={locale}
              t={t}
              lang={lesson.speechLang}
              slow={slow}
            />
          ) : null}

          {current === "apply" && apply ? (
            <div className="control-tile min-h-0">
              <p className="text-sm text-ink-soft">{t("applyLead")}</p>
              <p className="mt-3 font-semibold">{apply.prompt}</p>
              <p className="font-display mt-2 text-xl leading-7 text-sky-700">{apply.frame}</p>
              {reveal ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button type="button" className="text-left text-sm text-sky-700" onClick={() => say(apply.sample)}>
                    {t("sample")}: {apply.sample}
                  </button>
                  <SpeakButton text={apply.sample} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                </div>
              ) : (
                <SpeakButton text={apply.sample} lang={lesson.speechLang} slow={slow} label={t("hear")} />
              )}
            </div>
          ) : null}

          {current === "listen" ? (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn-primary" onClick={() => say(lesson.listening.text)}>
                  {t("playAudio")}
                </button>
                <SpeakButton text={lesson.listening.text} lang={lesson.speechLang} slow={slow} label={t("hear")} />
                {checked ? (
                  <button type="button" className="btn-ghost" onClick={() => setShowScript((value) => !value)}>
                    {showScript ? t("hideTranscript") : t("showTranscript")}
                  </button>
                ) : null}
              </div>
              {showScript && checked ? (
                <ul className="mt-4 grid gap-2">
                  {lesson.listening.lines.slice(0, 4).map((textLine) => (
                    <li key={textLine} className="text-sm font-semibold leading-6">
                      {textLine}
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
              title={reveal ? quote.text : "……"}
              speak={quote.text}
              reading={reveal ? quote.reading : undefined}
              sayVi={reveal ? quote.sayVi : undefined}
              locale={locale}
              t={t}
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

          {drill ? (
            <div className="mt-5">
              <p className="font-semibold leading-7">{promptOf(drill)}</p>
              <ExerciseField
                exercise={drill}
                value={given}
                disabled={checked}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [drill.id]: value }))}
              />
              <p
                className={`learn-feedback mt-3 text-sm font-semibold ${
                  checked ? (correct ? "text-sky-700" : "text-ink-soft") : "text-ink-soft"
                }`}
              >
                {checked
                  ? correct
                    ? t("right")
                    : t("wrong", { answer: Array.isArray(drill.answer) ? drill.answer.join(" ") : drill.answer })
                  : t("needAnswer")}
              </p>
            </div>
          ) : null}
        </div>

        {quizDone ? (
            <div className="learn-actions">
              <p className="text-sm font-semibold text-sky-700">{t("score", { ok: score.ok, total: score.total })}</p>
              <div className="learn-actions-right is-end">
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
            </div>
          ) : (
            <div className="learn-actions">
              <button type="button" className="btn-ghost" disabled={step === 0 && index === 0} onClick={goBack}>
                {t("back")}
              </button>
              <div className="learn-actions-right">
                <button
                  type="button"
                  className={`btn-ghost ${drill && checked && !correct ? "" : "invisible"}`}
                  onClick={() => {
                    if (!drill) return;
                    setCheckedMap((prev) => ({ ...prev, [drill.id]: false }));
                    setAnswers((prev) => ({ ...prev, [drill.id]: drill.type === "order" ? [] : "" }));
                  }}
                >
                  {t("retry")}
                </button>
                <button
                  type="button"
                  className={`btn-primary ${drill && !checked ? "" : "invisible"}`}
                  disabled={!canCheck}
                  onClick={checkNow}
                >
                  {t("check")}
                </button>
                <button type="button" className="btn-primary" disabled={!canNext} onClick={goNext}>
                  {step === steps.length - 1 && index === totalItems - 1 ? t("finish") : t("nextItem")}
                </button>
              </div>
            </div>
          )}
      </article>
    </div>
  );
}

function FocusCard({
  title,
  speak,
  reading,
  sayVi,
  meaning,
  note,
  lead,
  hideText,
  locale,
  t,
  lang,
  slow,
}: {
  title: string;
  speak: string;
  reading?: string;
  sayVi?: string;
  meaning?: string;
  note?: string;
  lead?: string;
  hideText?: boolean;
  locale: Locale;
  t: ReturnType<typeof useTranslations<"Learn">>;
  lang: string;
  slow: boolean;
}) {
  const hidden = hideText || title === "……";
  return (
    <div>
      {lead ? <p className="mb-3 text-sm leading-6 text-ink-soft">{lead}</p> : null}
      <div className="control-tile min-h-0">
        <div className="flex items-start justify-between gap-3">
          <button type="button" className="text-left" onClick={() => speakText(speak, lang, slow)}>
            <span className="font-display text-2xl font-semibold leading-snug text-sky-700">
              {hidden ? "……" : title}
            </span>
          </button>
          <SpeakButton text={speak} lang={lang} slow={slow} label={t("hear")} />
        </div>
        {hidden ? (
          <p className="mt-2 text-sm text-ink-soft">{t("hearFirst")}</p>
        ) : (
          <Phonetic
            reading={reading}
            sayVi={sayVi}
            locale={locale}
            phoneticLabel={t("phonetic")}
            sayViLabel={t("sayViLabel")}
          />
        )}
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
            <li key={row} className="leading-7">
              {row}
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
        placeholder="…"
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
