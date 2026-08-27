"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Phonetic, SpeakButton, speakText } from "@/components/learn/LearnAudio";
import { MatchGame } from "@/components/learn/LearnGame";
import { AskFab } from "@/components/learn/AskFab";
import { TapHistory } from "@/components/learn/TapHistory";
import { getAiAssist, getAiAssistServer, subscribeAiAssist } from "@/lib/learn/aiAssist";
import { buildAskPrompt, explainFromLessonClick, getTapHistory, getTapHistoryServer, isLessonSpeech, lookupTap, pushTapRecord, saveTapHistory, subscribeTapHistory, textFromLessonClick } from "@/lib/learn/history";
import type { Exercise, GrammarPattern, I18nText, Lesson, LessonTheory, VocabItem } from "@/lib/learn/types";

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

function uniqueLines(rows: string[] | undefined, seen: string[] = []) {
  const used = new Set(seen.map((item) => item.trim()));
  const out: string[] = [];
  for (const row of rows || []) {
    const key = row.trim();
    if (!key || used.has(key)) continue;
    used.add(key);
    out.push(row);
  }
  return out;
}

function theorySlides(theory: LessonTheory): TheorySlide[] {
  const slides: TheorySlide[] = [{ type: "intro" }];
  const points = uniqueLines(theory.points);
  if (points.length) slides.push({ type: "points", items: points.slice(0, 8) });
  if (theory.structure && theory.structure.trim() !== theory.levelNote.trim()) {
    slides.push({ type: "structure" });
  }
  theory.patterns.slice(0, 3).forEach((pattern) => slides.push({ type: "pattern", pattern }));
  const contrasts = uniqueLines(theory.contrasts);
  const mistakes = uniqueLines(theory.mistakes);
  const usage = uniqueLines(theory.usage, points);
  const examples = uniqueLines(
    theory.examples,
    theory.patterns.map((item) => item.example),
  );
  if (contrasts.length) slides.push({ type: "list", titleKey: "contrasts", items: contrasts.slice(0, 6) });
  if (mistakes.length) slides.push({ type: "list", titleKey: "mistakes", items: mistakes.slice(0, 6) });
  if (usage.length) slides.push({ type: "list", titleKey: "usage", items: usage.slice(0, 6) });
  if (examples.length) slides.push({ type: "list", titleKey: "examples", items: examples.slice(0, 6) });
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

function drillPromptHint(exercise: Exercise, lesson: Lesson, locale: Locale) {
  const goal = lesson.goal[locale] || lesson.goal[lesson.track];
  const pattern = lesson.theory.patterns[0];
  if (exercise.type === "mcq" && exercise.promptKey === "whichPattern") {
    return pattern ? `${pattern.form}. ${pattern.use} ${pattern.note}`.trim() : lesson.theory.structure || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichLine") {
    return lesson.listening.text || lesson.listening.lines[0] || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichSentence") {
    return (exercise.promptI18n && (exercise.promptI18n[locale] || exercise.promptI18n[lesson.track])) || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichFits") {
    return exercise.prompt || pattern?.use || goal;
  }
  const prompt = isI18nText(exercise.prompt) ? exercise.prompt[locale] || exercise.prompt[lesson.track] : exercise.prompt;
  const apply = lesson.theory.apply.find((item) => item.prompt === prompt || item.frame === prompt);
  if (apply) return `${apply.prompt} ${apply.frame} → ${apply.sample}`;
  const word = lesson.vocab.find((item) => prompt.includes(item.word));
  if (word) return word.usage || word.meaning[locale] || goal;
  const extra = lookupTap(lesson, prompt, locale);
  return extra.explain || goal;
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const lastAsk = useRef({ text: "", at: 0 });
  const thinkTimer = useRef<number>(0);
  const history = useSyncExternalStore(subscribeTapHistory, getTapHistory, getTapHistoryServer);
  const aiOn = useSyncExternalStore(subscribeAiAssist, getAiAssist, getAiAssistServer);
  const drawerOpen = aiOn && historyOpen;

  useEffect(() => () => window.clearTimeout(thinkTimer.current), []);

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
    if (stepName === "words") return lesson.vocab[i]?.word ?? t("quizItem", { n: i + 1 });
    if (stepName === "lines") return lesson.sentences[i]?.text ?? t("quizItem", { n: i + 1 });
    if (stepName === "quotes") return quotes[i]?.text ?? t("quizItem", { n: i + 1 });
    if (stepName === "apply") return lesson.theory.apply[i]?.prompt ?? t("quizItem", { n: i + 1 });
    if (stepName === "quiz") return t("quizItem", { n: i + 1 });
    if (stepName === "listen") return t("listenClip");
    if (stepName === "game") return t("game");
    if (stepName === "theory") {
      const item = slides[i];
      if (!item) return t("overview");
      if (item.type === "intro") return t("overview");
      if (item.type === "points") return t("keyPoints");
      if (item.type === "structure") return t("structure");
      if (item.type === "pattern") return item.pattern.form.replace(/_{2,}/g, "…").slice(0, 36);
      if (item.type === "list") return t(item.titleKey);
      if (item.type === "table") return t("swapTable");
      return t("tip");
    }
    return t("quizItem", { n: i + 1 });
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

  function recordTap(text: string, hint?: string) {
    if (!aiOn) return;
    const cleaned = text.trim();
    if (!cleaned || cleaned === "……") return;
    if (lastAsk.current.text === cleaned && Date.now() - lastAsk.current.at < 350) return;
    lastAsk.current = { text: cleaned, at: Date.now() };
    const extra = lookupTap(lesson, cleaned, locale);
    const goal = lesson.goal[locale] || lesson.goal[lesson.track];
    if (hint && (!extra.explain || extra.explain === goal)) extra.explain = hint;
    const answer = [extra.translation, extra.explain].filter(Boolean).join("\n") || extra.answer;
    saveTapHistory(
      pushTapRecord(getTapHistory(), {
        ask: cleaned,
        text: cleaned,
        prompt: buildAskPrompt(lesson, cleaned, locale),
        answer,
        lang: lesson.speechLang,
        track: lesson.track,
        locale,
        lessonId: lesson.id,
        unitId: lesson.unitId,
        kind: lesson.kind,
        source: "lookup",
        ...extra,
      }),
    );
    setHistoryOpen(true);
    setThinking(true);
    window.clearTimeout(thinkTimer.current);
    thinkTimer.current = window.setTimeout(() => setThinking(false), 900);
  }

  function say(text: string) {
    const cleaned = text.trim();
    if (!cleaned || cleaned === "……") return;
    speakText(cleaned, lesson.speechLang, slow);
    recordTap(cleaned);
  }

  function askFromPointer(event: MouseEvent<HTMLElement>) {
    const text = textFromLessonClick(event.target);
    if (!text) return;
    const hint = explainFromLessonClick(event.target);
    if (isLessonSpeech(lesson, text)) speakText(text, lesson.speechLang, slow);
    recordTap(text, hint);
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
    <div className="learn-desk mx-auto grid max-w-6xl gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="learn-rail">
        <p className="px-1 text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">{t("lessonMap")}</p>
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

      <article className="learn-card glass-tile min-w-0 p-0" onClickCapture={askFromPointer}>
        <div className="learn-card-head">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase" data-ask-skip>
              {targetName} · {t(current)} · {t("ofItems", { n: index + 1, total: totalItems })}
            </p>
            <div className="flex items-center gap-2" data-ask-skip>
              <button type="button" className={slow ? "learn-speed is-on" : "learn-speed"} onClick={() => setSlow((value) => !value)}>
                {slow ? t("slow") : t("normal")}
              </button>
            </div>
          </div>
          <h1
            className="learn-ask-target font-display mt-2 text-xl leading-tight text-sky-700 sm:text-2xl"
            data-ask={lesson.title[lesson.track]}
            data-explain={lesson.theory.levelNote || lesson.goal[locale] || lesson.goal[lesson.track]}
          >
            {lesson.title[lesson.track]}
          </h1>
          {support ? (
            <p
              className="learn-ask-target mt-1 text-sm text-ink-soft"
              data-ask={lesson.title[support]}
              data-explain={lesson.theory.levelNote || lesson.goal[locale] || lesson.goal[lesson.track]}
            >
              {lesson.title[support]}
            </p>
          ) : null}
        </div>

        <div className="learn-stage min-h-0 flex-1 overflow-auto px-5 pb-4 sm:px-7">
          {current === "theory" && slide ? (
            <TheorySlideView
              slide={slide}
              theory={lesson.theory}
              goal={lesson.goal[lesson.track]}
              goalSupport={support ? lesson.goal[support] : undefined}
              vocab={lesson.vocab.slice(0, 8)}
              support={support}
              t={t}
              slow={slow}
              lang={lesson.speechLang}
              onSay={say}
              onHeard={recordTap}
            />
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
              onTap={say}
              onHeard={recordTap}
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
              onTap={say}
              onHeard={recordTap}
            />
          ) : null}

          {current === "apply" && apply ? (
            <div className="learn-board" data-explain={`${apply.prompt} ${apply.frame} → ${apply.sample}`}>
              <p className="learn-kicker">{t("apply")}</p>
              <h2 className="learn-board-title learn-ask-target" data-ask={apply.prompt} data-explain={`${apply.frame} → ${apply.sample}`}>
                {apply.prompt}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{t("applyLead")}</p>
              <p
                className="learn-ask-target font-display mt-4 cursor-pointer text-2xl leading-8 text-sky-700"
                data-ask={apply.frame}
                data-explain={`${apply.prompt} → ${apply.sample}`}
                onClick={() => say(apply.sample)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") say(apply.sample);
                }}
                role="button"
                tabIndex={0}
              >
                {apply.frame}
              </p>
              {reveal ? (
                <ul className="mt-4 grid gap-2">
                  <SpeakRow text={apply.sample} note={t("sample")} lang={lesson.speechLang} slow={slow} label={t("hear")} onSay={say} onHeard={recordTap} />
                </ul>
              ) : (
                <div className="mt-4">
                  <SpeakButton text={apply.sample} lang={lesson.speechLang} slow={slow} label={t("hear")} onHeard={recordTap} />
                </div>
              )}
            </div>
          ) : null}

          {current === "listen" ? (
            <div className="learn-board" data-explain={lesson.listening.text || lesson.goal[locale] || lesson.goal[lesson.track]}>
              <p className="learn-kicker">{t("listen")}</p>
              <h2 className="learn-board-title learn-ask-target" data-ask={t("listenClip")} data-explain={lesson.listening.text}>
                {t("listenClip")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{t("listenFirst")}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" className="btn-primary" onClick={() => say(lesson.listening.text)}>
                  {t("playAudio")}
                </button>
                <SpeakButton text={lesson.listening.text} lang={lesson.speechLang} slow={slow} label={t("hear")} onHeard={recordTap} />
                {checked ? (
                  <button type="button" className="btn-ghost" onClick={() => setShowScript((value) => !value)}>
                    {showScript ? t("hideTranscript") : t("showTranscript")}
                  </button>
                ) : null}
              </div>
              {showScript && checked ? (
                <ul className="mt-5 grid gap-2">
                  {lesson.listening.lines.slice(0, 6).map((textLine) => (
                    <SpeakRow
                      key={textLine}
                      text={textLine}
                      lang={lesson.speechLang}
                      slow={slow}
                      label={t("hear")}
                      onSay={say}
                      onHeard={recordTap}
                    />
                  ))}
                </ul>
              ) : null}
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
              onTap={say}
              onHeard={recordTap}
            />
          ) : null}

          {current === "game" ? (
            <div data-explain={lesson.goal[locale] || lesson.goal[lesson.track]}>
              <p className="mb-4 text-sm leading-6 text-ink-soft" data-ask={t("matchLead")}>
                {t("matchLead")}
              </p>
              <MatchGame
                vocab={lesson.vocab.slice(0, 6)}
                locale={locale}
                support={support}
                matchedLabel={t("matched")}
                doneLabel={t("matchDone")}
                lang={lesson.speechLang}
                onTap={say}
              />
            </div>
          ) : null}

          {drill ? (
            <div className="mt-5">
              <p
                className="learn-ask-target font-semibold leading-7"
                data-ask={promptOf(drill)}
                data-explain={drillPromptHint(drill, lesson, locale)}
              >
                {promptOf(drill)}
              </p>
              <ExerciseField
                exercise={drill}
                value={given}
                disabled={checked}
                onAsk={recordTap}
                onChange={(value) => {
                  setAnswers((prev) => ({ ...prev, [drill.id]: value }));
                  if (typeof value !== "string") return;
                  if (isLessonSpeech(lesson, value)) say(value);
                  else recordTap(value);
                }}
              />
              <p
                className={`learn-feedback mt-3 text-sm font-semibold ${
                  checked ? (correct ? "text-sky-700" : "text-ink-soft") : "text-ink-soft"
                }`}
                data-ask-skip
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
            <div className="learn-actions" data-ask-skip>
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
            <div className="learn-actions" data-ask-skip>
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
      <TapHistory
        open={drawerOpen}
        thinking={aiOn && thinking}
        items={history}
        locale={locale}
        slow={slow}
        labels={{
          title: t("tapHistory"),
          empty: t("tapHistoryEmpty"),
          close: t("tapHistoryClose"),
          clear: t("tapHistoryClear"),
          hear: t("hear"),
          youAsked: t("youAsked"),
          reply: t("linlinReply"),
          replyStub: t("linlinReplyStub"),
          thinking: t("linlinThinking"),
          translation: t("tapTranslate"),
          explain: t("tapExplain"),
          phonetic: t("phonetic"),
          sayVi: t("sayViLabel"),
          count: t("tapHistoryCount", { n: history.length }),
        }}
        onClose={() => setHistoryOpen(false)}
        onClear={() => saveTapHistory([])}
      />
      {aiOn ? (
        <AskFab
          open={drawerOpen}
          thinking={aiOn && thinking}
          count={history.length}
          openLabel={t("tapHistory")}
          closeLabel={t("tapHistoryClose")}
          onToggle={() => setHistoryOpen((value) => !value)}
        />
      ) : null}
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
  onTap,
  onHeard,
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
  onTap?: (text: string) => void;
  onHeard?: (text: string) => void;
}) {
  const hidden = hideText || title === "……";
  return (
    <div className="learn-board">
      {lead ? (
        <p className="mb-3 text-sm leading-6 text-ink-soft" data-ask={speak}>
          {lead}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="learn-ask-target min-w-0 text-left" data-ask={speak} onClick={() => (onTap ? onTap(speak) : speakText(speak, lang, slow))}>
          <span className="font-display text-3xl font-semibold leading-snug text-sky-700">
            {hidden ? "……" : title}
          </span>
        </button>
        <SpeakButton text={speak} lang={lang} slow={slow} label={t("hear")} onHeard={onHeard} />
      </div>
      {hidden ? (
        <p className="mt-3 text-sm text-ink-soft">{t("hearFirst")}</p>
      ) : (
        <Phonetic
          reading={reading}
          sayVi={sayVi}
          locale={locale}
          phoneticLabel={t("phonetic")}
          sayViLabel={t("sayViLabel")}
        />
      )}
      {meaning ? (
        <p className="learn-goal mt-4 text-base leading-7" data-ask={speak}>
          {meaning}
        </p>
      ) : null}
      {note ? (
        <p className="mt-3 text-sm leading-6 text-sky-700" data-ask={speak}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function SlideShell({
  kicker,
  title,
  explain,
  children,
}: {
  kicker: string;
  title: string;
  explain?: string;
  children: ReactNode;
}) {
  return (
    <div className="learn-board" data-explain={explain}>
      <p className="learn-kicker">{kicker}</p>
      <h2 className="learn-board-title learn-ask-target" data-ask={title} data-explain={explain}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SpeakRow({
  text,
  note,
  lang,
  slow,
  label,
  onSay,
  onHeard,
}: {
  text: string;
  note?: string;
  lang: string;
  slow: boolean;
  label: string;
  onSay: (text: string) => void;
  onHeard?: (text: string) => void;
}) {
  return (
    <li className="learn-speak-row">
      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSay(text)}>
        <span className="block font-semibold leading-6 text-sky-700">{text}</span>
        {note ? <span className="mt-0.5 block text-sm text-ink-soft">{note}</span> : null}
      </button>
      <SpeakButton text={text} lang={lang} slow={slow} label={label} onHeard={onHeard} />
    </li>
  );
}

function TheorySlideView({
  slide,
  theory,
  goal,
  goalSupport,
  vocab,
  support,
  t,
  slow,
  lang,
  onSay,
  onHeard,
}: {
  slide: TheorySlide;
  theory: LessonTheory;
  goal: string;
  goalSupport?: string;
  vocab: VocabItem[];
  support: Locale | null;
  t: ReturnType<typeof useTranslations<"Learn">>;
  slow: boolean;
  lang: string;
  onSay: (text: string) => void;
  onHeard?: (text: string) => void;
}) {
  if (slide.type === "intro") {
    return (
      <SlideShell kicker={t("theory")} title={theory.levelTitle || t("overview")} explain={theory.levelNote || goal}>
        {goal ? (
          <div className="learn-goal">
            <p className="learn-kicker">{t("goalLabel")}</p>
            <p className="mt-1 leading-6" data-ask={goal} data-explain={theory.levelNote || goal}>
              {goal}
            </p>
            {goalSupport ? (
              <p className="mt-1 text-sm text-ink-soft" data-ask={goalSupport} data-explain={goal}>
                {goalSupport}
              </p>
            ) : null}
          </div>
        ) : null}
        <p className="mt-4 leading-7" data-ask={theory.levelNote} data-explain={goal}>
          {theory.levelNote}
        </p>
        {vocab.length ? (
          <div className="mt-5">
            <p className="learn-kicker">{t("todayHear")}</p>
            <ul className="learn-chip-row">
              {vocab.map((item) => (
                <li key={item.word} className="learn-chip">
                  <button type="button" className="min-w-0 text-left" data-ask={item.word} onClick={() => onSay(item.word)}>
                    <span className="block font-semibold text-sky-700">{item.word}</span>
                    {support ? <span className="block truncate text-xs text-ink-soft">{item.meaning[support]}</span> : null}
                  </button>
                  <SpeakButton text={item.word} lang={lang} slow={slow} label={t("hear")} onHeard={onHeard} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SlideShell>
    );
  }
  if (slide.type === "points") {
    return (
      <SlideShell kicker={t("keyPoints")} title={t("rememberThese")} explain={slide.items.slice(0, 3).join(" ")}>
        <ol className="learn-points">
          {slide.items.map((point, i) => (
            <li key={`${i}-${point}`} className="learn-point">
              <span className="learn-point-n">{i + 1}</span>
              <button type="button" className="min-w-0 flex-1 text-left leading-6" onClick={() => onSay(point)}>
                {point}
              </button>
            </li>
          ))}
        </ol>
      </SlideShell>
    );
  }
  if (slide.type === "structure") {
    return (
      <SlideShell kicker={t("structure")} title={t("howSentence")} explain={theory.structure}>
        <p className="leading-7">
          <button type="button" className="text-left" onClick={() => onSay(theory.structure)}>
            {theory.structure}
          </button>
        </p>
      </SlideShell>
    );
  }
  if (slide.type === "pattern") {
    const pattern = slide.pattern;
    return (
      <SlideShell kicker={t("pattern")} title={pattern.form} explain={`${pattern.use} ${pattern.note}`.trim()}>
        <button type="button" className="text-left text-sm leading-6 text-ink-soft" onClick={() => onSay(pattern.form)}>
          {pattern.use}
        </button>
        <ul className="mt-4 grid gap-2">
          <SpeakRow text={pattern.example} note={pattern.note} lang={lang} slow={slow} label={t("hear")} onSay={onSay} onHeard={onHeard} />
        </ul>
      </SlideShell>
    );
  }
  if (slide.type === "list") {
    return (
      <SlideShell kicker={t(slide.titleKey)} title={t(slide.titleKey)} explain={slide.items.slice(0, 3).join(" ")}>
        <ul className="mt-1 grid gap-2">
          {slide.items.map((row, i) =>
            slide.titleKey === "examples" ? (
              <SpeakRow key={`${i}-${row}`} text={row} lang={lang} slow={slow} label={t("hear")} onSay={onSay} onHeard={onHeard} />
            ) : (
              <li key={`${i}-${row}`} className="learn-point">
                <span className="learn-point-n">{i + 1}</span>
                <button type="button" className="min-w-0 flex-1 text-left leading-6" onClick={() => onSay(row)}>
                  {row}
                </button>
              </li>
            ),
          )}
        </ul>
      </SlideShell>
    );
  }
  if (slide.type === "table") {
    return (
      <SlideShell kicker={t("swapTable")} title={theory.table.title} explain={theory.table.rows.slice(0, 3).join(" · ")}>
        <ul className="learn-swap">
          {theory.table.rows.slice(0, 8).map((row) => {
            const [left, right] = row.split(" → ");
            return (
              <li key={row} className="learn-swap-row">
                <button type="button" className="font-semibold text-sky-700" onClick={() => onSay(left || row)}>
                  {left || row}
                </button>
                {right ? (
                  <button type="button" className="text-left text-sm text-ink-soft" onClick={() => onSay(right)}>
                    {right}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </SlideShell>
    );
  }
  return (
    <SlideShell kicker={t("tip")} title={t("keepThis")} explain={theory.tip}>
      <p className="leading-7">
        <button type="button" className="text-left" onClick={() => onSay(theory.tip)}>
          {theory.tip}
        </button>
      </p>
    </SlideShell>
  );
}

function ExerciseField({
  exercise,
  value,
  disabled,
  onChange,
  onAsk,
}: {
  exercise: Exercise;
  value: string | string[] | undefined;
  disabled: boolean;
  onChange: (value: string | string[]) => void;
  onAsk?: (text: string) => void;
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
            onClick={() => {
              onChange([...chosen, token]);
              onAsk?.(token);
            }}
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}
