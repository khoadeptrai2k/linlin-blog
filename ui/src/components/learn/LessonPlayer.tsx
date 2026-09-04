"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Phonetic, SpeakButton, speakQueue, speakText } from "@/components/learn/LearnAudio";
import { MatchGame } from "@/components/learn/LearnGame";
import { LectureButton, LessonBrief, LessonCoach, LessonPodcast, LessonSpine, LinlinTeacher, TargetPhrase, ExampleBank, GlossLine } from "@/components/learn/LessonGuide";
import { UnitScene, VocabStrip, WordPicture, optionPicture } from "@/components/learn/LessonArt";
import { pictureForVocab } from "@/lib/learn/picture";
import { isCoachCopy, isModelUtterance, lectureChunks, lineExplain, pairByValue, slideSpeech, teacherTheory } from "@/lib/learn/guide";
import { UI_SPEECH, glossOf, optionGloss, pickI18n, wordGloss } from "@/lib/learn/language";
import { drillHelp } from "@/lib/learn/quiz";
import { AskFab } from "@/components/learn/AskFab";
import { TapHistory } from "@/components/learn/TapHistory";
import { getAiAssist, getAiAssistServer, subscribeAiAssist } from "@/lib/learn/aiAssist";
import { buildAskPrompt, explainFromLessonClick, getTapHistory, getTapHistoryServer, isLessonSpeech, lookupTap, pushTapRecord, saveTapHistory, subscribeTapHistory, textFromLessonClick } from "@/lib/learn/history";
import { markLessonDone } from "@/lib/learn/progress";
import type { Exercise, GrammarPattern, I18nText, Lesson, VocabItem } from "@/lib/learn/types";

function saveDone(track: string, id: string) {
  markLessonDone(track, id);
  void fetch("/api/progress", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ track, lessonId: id }),
  }).catch(() => undefined);
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
  whichSentence: string,
): Exercise[] {
  const extras: Exercise[] = [];
  const vocab = lesson.vocab.filter((item) => item.word);
  if (support && vocab.length >= 3) {
    const glosses = vocab.map((item) => item.meaning[support]);
    vocab.slice(0, 6).forEach((item, index) => {
      const drill = makeMcq(
        `${lesson.id}-rt-mean-${index}`,
        whatMeans(item.word),
        item.meaning[support],
        glosses,
        `${lesson.id}-mean-${index}`,
      );
      if (drill) extras.push(drill);
    });
    vocab.slice(0, 4).forEach((item, index) => {
      const drill = makeMcq(
        `${lesson.id}-rt-pic-${index}`,
        whatMeans(item.word),
        item.word,
        vocab.map((row) => row.word),
        `${lesson.id}-pic-${index}`,
      );
      if (drill) extras.push(drill);
    });
  } else if (vocab.length >= 3) {
    vocab.slice(0, 4).forEach((item, index) => {
      const drill = makeMcq(
        `${lesson.id}-rt-word-${index}`,
        item.reading || item.sayVi || item.word,
        item.word,
        vocab.map((row) => row.word),
        `${lesson.id}-word-${index}`,
      );
      if (drill) extras.push(drill);
    });
  }
  const lines = lesson.sentences.filter((item) => item.text && item.text.length < 40).slice(0, 8);
  if (lines.length >= 3) {
    lines.slice(0, 4).forEach((item, index) => {
      const drill = makeMcq(
        `${lesson.id}-rt-sent-${index}`,
        whichSentence,
        item.text,
        lines.map((row) => row.text),
        `${lesson.id}-sent-${index}`,
      );
      if (drill?.type === "mcq") {
        drill.promptKey = "whichSentence";
        drill.promptI18n = item.meaning;
        extras.push(drill);
      }
    });
  }
  return extras;
}

function stepsFor(kind: Lesson["kind"]) {
  const core =
    kind === "play"
      ? (["quotes", "game", "quiz"] as const)
      : kind === "practice"
        ? (["apply", "quiz"] as const)
        : kind === "listen"
          ? (["listen", "quiz"] as const)
          : kind === "words"
            ? (["words", "recognize", "write", "quiz"] as const)
            : kind === "teach" || kind === "drill"
              ? (["theory", "quiz"] as const)
              : kind === "review"
                ? (["words", "recognize", "write", "lines", "quiz"] as const)
                : (["theory", "words", "recognize", "write", "lines", "apply", "quiz"] as const);
  return ["brief", ...core] as const;
}

function stepToken(stepName: string) {
  if (stepName === "brief") return "•";
  if (stepName === "theory") return "1";
  if (stepName === "words") return "2";
  if (stepName === "recognize") return "3";
  if (stepName === "write") return "4";
  if (stepName === "listen") return "3";
  if (stepName === "lines" || stepName === "apply" || stepName === "quiz") return "5";
  if (stepName === "game" || stepName === "quotes") return "5";
  return "•";
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

function theorySlides(lesson: Lesson): TheorySlide[] {
  const theory = lesson.theory;
  const slides: TheorySlide[] = [{ type: "intro" }];
  const points = uniqueLines(theory.points).filter((item) => !isCoachCopy(item));
  if (points.length) slides.push({ type: "points", items: points.slice(0, 8) });
  if (theory.structure && theory.structure.trim() !== theory.levelNote.trim() && !isCoachCopy(theory.structure)) {
    slides.push({ type: "structure" });
  }
  theory.patterns
    .filter((pattern) => !isCoachCopy(pattern.example))
    .slice(0, 3)
    .forEach((pattern) => slides.push({ type: "pattern", pattern }));
  const contrasts = uniqueLines(theory.contrasts).filter((item) => !isCoachCopy(item));
  const mistakes = uniqueLines(theory.mistakes).filter((item) => !isCoachCopy(item));
  const usage = uniqueLines(theory.usage, points).filter((item) => !isCoachCopy(item));
  const examples = uniqueLines(
    theory.examples,
    theory.patterns.map((item) => item.example),
  ).filter((item) => isModelUtterance(lesson, item));
  if (contrasts.length) slides.push({ type: "list", titleKey: "contrasts", items: contrasts.slice(0, 6) });
  if (mistakes.length) slides.push({ type: "list", titleKey: "mistakes", items: mistakes.slice(0, 6) });
  if (usage.length) slides.push({ type: "list", titleKey: "usage", items: usage.slice(0, 6) });
  if (examples.length) slides.push({ type: "list", titleKey: "examples", items: examples.slice(0, 6) });
  if (theory.table?.rows?.length) slides.push({ type: "table" });
  if (theory.tip && !isCoachCopy(theory.tip)) slides.push({ type: "tip" });
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

function drillPromptHint(exercise: Exercise, lesson: Lesson, locale: Locale, guide?: Lesson | null) {
  const goal = lesson.goal[locale] || lesson.goal[lesson.track];
  const guided = teacherTheory(lesson, guide);
  if (exercise.type === "mcq" && exercise.promptKey === "whichPattern") {
    const use = guided.patterns[0];
    return use ? `${use.form}. ${use.use} ${use.note}`.trim() : guided.structure || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichLine") {
    return lineExplain(lesson, locale, lesson.listening.lines[0] || "", guide) || guided.levelNote || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichSentence") {
    return (exercise.promptI18n && (exercise.promptI18n[locale] || exercise.promptI18n[lesson.track])) || goal;
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichFits") {
    return exercise.prompt || guided.patterns[0]?.use || goal;
  }
  const prompt = isI18nText(exercise.prompt) ? exercise.prompt[locale] || exercise.prompt[lesson.track] : exercise.prompt;
  const applyIndex = lesson.theory.apply.findIndex((item) => item.prompt === prompt || item.frame === prompt || item.sample === exercise.answer);
  if (applyIndex >= 0) {
    const item = lesson.theory.apply[applyIndex];
    const explained = guide?.theory.apply[applyIndex];
    return `${explained?.prompt || item.prompt} → ${lineExplain(lesson, locale, item.sample, guide) || item.sample}`;
  }
  const word = lesson.vocab.find((item) => prompt.includes(item.word));
  if (word) return wordGloss(word, locale, lesson.track) || word.usage || word.meaning[locale] || goal;
  const extra = lookupTap(lesson, prompt, locale);
  return extra.explain || guided.levelNote || goal;
}

function drillFor(
  current: string,
  lesson: Lesson,
  index: number,
  support: Locale | null,
  t: ReturnType<typeof useTranslations<"Learn">>,
  quiz: Exercise[],
  guide?: Lesson | null,
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
  if (current === "recognize") {
    const word = lesson.vocab[index];
    if (!word) return null;
    const words = lesson.vocab.map((item) => item.word);
    const gloss = support ? word.meaning[support] : word.reading || word.meaning[lesson.track];
    return makeMcq(
      `${lesson.id}-recognize-${index}`,
      `${t("recognizePrompt")} · ${gloss}`,
      word.word,
      words,
      `${lesson.id}-recognize-${index}`,
    );
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
    const prompt = guide?.theory.apply[index]?.prompt || item.prompt;
    const choice = makeMcq(
      `${lesson.id}-apply-${index}`,
      prompt,
      item.sample,
      samples,
      `${lesson.id}-ap-${index}`,
    );
    if (choice) return choice;
    return { id: `${lesson.id}-apply-gap-${index}`, type: "gap", prompt: guide?.theory.apply[index]?.frame || item.frame, answer: item.sample };
  }
  if (current === "listen") {
    const lines = lesson.listening.lines.filter(Boolean);
    const choice = makeMcq(`${lesson.id}-listen-pick`, t("whichLine"), lines[0], lines, `${lesson.id}-listen`);
    if (choice?.type === "mcq") choice.promptKey = "whichLine";
    return choice;
  }
  return null;
}

export function LessonPlayer({ lesson, locale, nextId, guide }: { lesson: Lesson; locale: Locale; nextId?: string; guide?: Lesson | null }) {
  const t = useTranslations("Learn");
  const steps = stepsFor(lesson.kind);
  const [step, setStep] = useState(0);
  const [item, setItem] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [passed, setPassed] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [slow, setSlow] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [writingMap, setWritingMap] = useState<Record<string, boolean>>({});
  const [shadowRepeats, setShadowRepeats] = useState(0);
  const [gameDone, setGameDone] = useState(false);
  const [heardPodcast, setHeardPodcast] = useState(false);
  const [lecturePlaying, setLecturePlaying] = useState(false);
  const lastAsk = useRef({ text: "", at: 0 });
  const thinkTimer = useRef<number>(0);
  const history = useSyncExternalStore(subscribeTapHistory, getTapHistory, getTapHistoryServer);
  const aiOn = useSyncExternalStore(subscribeAiAssist, getAiAssist, getAiAssistServer);
  const drawerOpen = aiOn && historyOpen;

  useEffect(() => () => window.clearTimeout(thinkTimer.current), []);

  const support = supportLocale(lesson.track, locale);
  const current = steps[step];
  const targetName = localeMeta[lesson.track].native;
  const slides = useMemo(() => theorySlides(lesson), [lesson]);
  const quotes = (lesson.quotes?.length ? lesson.quotes : lesson.sentences).slice(0, 6);

  const quiz = useMemo(() => {
    const extras = extraExercises(lesson, support, (word) => t("whatMeans", { word }), t("whichSentence"));
    const core = lesson.exercises.slice(0, 6);
    const seen = new Set(core.map((item) => item.id));
    return [...core, ...extras.filter((item) => !seen.has(item.id))].slice(0, 12);
  }, [lesson, support, t]);

  const totalItems = (() => {
    if (current === "brief") return 1;
    if (current === "theory") return Math.max(1, slides.length);
    if (current === "words") return Math.max(1, lesson.vocab.length);
    if (current === "recognize") return Math.max(1, Math.min(6, lesson.vocab.length));
    if (current === "write") return Math.max(1, Math.min(6, lesson.vocab.length));
    if (current === "lines") return Math.max(1, lesson.sentences.length);
    if (current === "apply") return Math.max(1, lesson.theory.apply.length);
    if (current === "quotes") return Math.max(1, quotes.length);
    if (current === "quiz") return Math.max(1, quiz.length);
    return 1;
  })();
  const index = Math.min(item, totalItems - 1);
  const drill = drillFor(current, lesson, index, support, t, quiz, guide);
  const given = drill ? answers[drill.id] : undefined;
  const checked = drill ? Boolean(checkedMap[drill.id]) : false;
  const correct = drill ? isRight(drill, given) : true;
  const help = drill ? drillHelp(drill, lesson, locale, guide, t) : null;

  function railLabel(stepName: string, i: number) {
    if (stepName === "words") return lesson.vocab[i]?.word ?? t("quizItem", { n: i + 1 });
    if (stepName === "recognize") return lesson.vocab[i]?.word ?? t("quizItem", { n: i + 1 });
    if (stepName === "write") return lesson.vocab[i]?.word ?? t("quizItem", { n: i + 1 });
    if (stepName === "lines") return lesson.sentences[i]?.text ?? t("quizItem", { n: i + 1 });
    if (stepName === "quotes") return quotes[i]?.text ?? t("quizItem", { n: i + 1 });
    if (stepName === "apply") return guide?.theory.apply[i]?.prompt || lesson.theory.apply[i]?.prompt || t("quizItem", { n: i + 1 });
    if (stepName === "quiz") return t("quizItem", { n: i + 1 });
    if (stepName === "listen") return t("podcastTitle");
    if (stepName === "game") return t("game");
    if (stepName === "brief") return t("briefTitle");
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
    if (stepName === "brief") return 1;
    if (stepName === "theory") return Math.max(1, slides.length);
    if (stepName === "words") return Math.max(1, lesson.vocab.length);
    if (stepName === "recognize") return Math.max(1, Math.min(6, lesson.vocab.length));
    if (stepName === "write") return Math.max(1, Math.min(6, lesson.vocab.length));
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
    recordTap(text, hint);
  }

  function finish() {
    saveDone(lesson.track, lesson.id);
    setDone(true);
  }

  function goTo(nextStep: number, nextItem: number) {
    setStep(nextStep);
    setItem(nextItem);
    setLecturePlaying(false);
  }

  function checkNow() {
    if (!drill || !hasAnswer(drill, given)) return;
    const rightNow = isRight(drill, given);
    setCheckedMap((prev) => ({ ...prev, [drill.id]: true }));
    if (rightNow) setPassed((prev) => ({ ...prev, [keyOf(step, index)]: true }));
    else setHearts((value) => Math.max(0, value - 1));
  }

  function goNext() {
    if (drill && !checked) return;
    if (current === "write" && !writingMap[keyOf(step, index)]) return;
    if (!drill || (checked && correct)) setPassed((prev) => ({ ...prev, [keyOf(step, index)]: true }));
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
  const listenReady = heardPodcast || shadowRepeats >= 3;
  const canCheck = Boolean(drill && !checked && hasAnswer(drill, given));
  const canNext =
    current === "brief"
      ? true
      : current === "write"
        ? Boolean(writingMap[keyOf(step, index)])
        : current === "game"
          ? gameDone || lesson.vocab.length === 0
          : current === "listen"
            ? Boolean((!drill || (checked && correct)) && listenReady)
            : !drill || (checked && correct);
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
  const lessonItemsTotal = steps.reduce((sum, stepName) => sum + countFor(stepName), 0);
  const currentItemNumber = steps.slice(0, step).reduce((sum, stepName) => sum + countFor(stepName), 0) + index + 1;
  const progress = lessonItemsTotal ? (currentItemNumber / lessonItemsTotal) * 100 : 0;
  const xpEarned = Object.keys(passed).length * 5 + score.ok * 2;

  return (
    <div className={`learn-desk duo-lesson-shell mx-auto grid gap-4 ${drawerOpen ? "is-ask-open" : ""}`}>
      <div className="duo-lesson-top" data-ask-skip>
        <Link href={`/learn/${lesson.track}`} className="duo-back-link">
          ← {t("backTrack")}
        </Link>
        <div className="duo-progress">
          <span style={{ width: `${Math.min(100, Math.max(4, progress))}%` }} />
        </div>
        <div className="duo-hud">
          <span>{t("heartsLabel", { hearts })}</span>
          <span>{t("xpShort", { xp: xpEarned })}</span>
        </div>
      </div>

      <LessonSpine kind={lesson.kind} />

      <aside className="learn-rail duo-rail">
        <p className="px-1 text-xs font-extrabold uppercase text-ink-soft">{t("lessonMap")}</p>
        <ol className="mt-3 grid gap-3">
          {steps.map((stepName, stepIndex) => (
            <li key={stepName}>
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase text-ink">
                <span className="duo-step-dot">{stepToken(stepName)}</span>
                {t(stepName)}
              </p>
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

      <article className="learn-card duo-lesson-card min-w-0 p-0" onClickCapture={askFromPointer}>
        <div className="learn-card-head">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-extrabold uppercase text-sky-700" data-ask-skip>
              {targetName} · {t(current)} · {t("ofItems", { n: index + 1, total: totalItems })}
            </p>
            <div className="flex items-center gap-2" data-ask-skip>
              {current === "theory" || current === "brief" ? (
                <LectureButton
                  chunks={
                    current === "theory" && slide
                      ? slideSpeech(lesson, locale, slide, guide)
                      : lectureChunks(lesson, locale, guide)
                  }
                  fallbackLang={lesson.speechLang}
                  slow={slow}
                  playing={lecturePlaying}
                  onPlaying={setLecturePlaying}
                />
              ) : null}
              <button type="button" className={slow ? "learn-speed is-on" : "learn-speed"} onClick={() => setSlow((value) => !value)}>
                {slow ? t("slow") : t("normal")}
              </button>
            </div>
          </div>
          <h1
            className="learn-ask-target mt-2 text-xl font-bold leading-tight text-ink sm:text-2xl"
            data-ask={pickI18n(lesson.title, locale, lesson.track)}
            data-explain={pickI18n(lesson.goal, locale, lesson.track)}
          >
            {pickI18n(lesson.title, locale, lesson.track)}
          </h1>
          {locale !== lesson.track ? (
            <p
              className="learn-ask-target mt-1 text-sm text-ink-soft"
              data-ask={lesson.title[lesson.track]}
              data-explain={pickI18n(lesson.goal, locale, lesson.track)}
            >
              {lesson.title[lesson.track]}
            </p>
          ) : null}
          <LessonCoach step={current} />
        </div>

        <div className="learn-stage min-h-0 flex-1 overflow-auto px-5 pb-4 sm:px-7">
          {current === "brief" ? (
            <LessonBrief
              lesson={lesson}
              locale={locale}
              guide={guide}
              slow={slow}
              onStart={goNext}
              onSay={recordTap}
            />
          ) : null}

          {current === "theory" && slide ? (
            <TheorySlideView
              slide={slide}
              lesson={lesson}
              guide={guide}
              locale={locale}
              t={t}
              slow={slow}
              onSay={recordTap}
            />
          ) : null}

          {current === "words" && word ? (
            <div className="grid gap-4">
              <FocusCard
                title={word.word}
                speak={word.word}
                reading={word.reading}
                sayVi={word.sayVi}
                picture={pictureForVocab(word, lesson.unitId)}
                meaning={
                  drill?.type === "mcq" && support && !reveal && drill.answer === word.meaning[support]
                    ? undefined
                    : wordGloss(word, locale, lesson.track)
                }
                note={
                  reveal && word.usage
                    ? `${t("howUsed")}: ${word.usage}`
                    : guide?.vocab[index]?.usage
                      ? `${t("inYourLang", { name: localeMeta[locale].native })} ${guide.vocab[index].usage}`
                      : undefined
                }
                hideText={!reveal && Boolean(drill && drill.type === "mcq" && drill.answer === word.word)}
                locale={locale}
                t={t}
                lang={lesson.speechLang}
                slow={slow}
                onTap={recordTap}
                onHeard={recordTap}
                lead={t("audioExplain", { name: targetName, ui: localeMeta[locale].native })}
              />
              <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={recordTap} around={word.word} limit={5} />
            </div>
          ) : null}

          {current === "recognize" && word ? (
            <div className="grid gap-4">
              <LinlinTeacher>
                <p>{t("coachRecognize")}</p>
                {wordGloss(word, locale, lesson.track) ? (
                  <GlossLine text={wordGloss(word, locale, lesson.track) || ""} />
                ) : null}
              </LinlinTeacher>
              <div className="learn-focus-art">
                <WordPicture emoji={pictureForVocab(word, lesson.unitId)} size="lg" />
              </div>
              <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={recordTap} around={word.word} limit={3} />
            </div>
          ) : null}

          {current === "write" && word ? (
            <WritingPractice
              word={word}
              locale={locale}
              unitId={lesson.unitId}
              support={support}
              t={t}
              lang={lesson.speechLang}
              slow={slow}
              done={Boolean(writingMap[keyOf(step, index)])}
              onSay={recordTap}
              onDone={() => setWritingMap((prev) => ({ ...prev, [keyOf(step, index)]: true }))}
            />
          ) : null}

          {current === "lines" && line ? (
            <div className="grid gap-4">
              <FocusCard
                title={reveal ? line.text : "……"}
                speak={line.text}
                reading={reveal ? line.reading : undefined}
                sayVi={reveal ? line.sayVi : undefined}
                picture={optionPicture(line.text, lesson.vocab, lesson.unitId, locale)}
                meaning={line.meaning[locale] && line.meaning[locale] !== line.text ? line.meaning[locale] : undefined}
                locale={locale}
                t={t}
                lang={lesson.speechLang}
                slow={slow}
                onTap={recordTap}
                onHeard={recordTap}
              />
              <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={recordTap} around={line.text} limit={5} />
            </div>
          ) : null}

          {current === "apply" && apply ? (
            <div className="learn-board">
              <LinlinTeacher>
                <p>{t("applyLead")}</p>
                <p className="mt-2 leading-6">{guide?.theory.apply[index]?.prompt || t("applyLead")}</p>
                {guide?.theory.apply[index]?.sample ? (
                  <p className="mt-2 leading-6">
                    {t("inYourLang", { name: localeMeta[locale].native })} {guide.theory.apply[index].sample}
                  </p>
                ) : null}
              </LinlinTeacher>
              {isCoachCopy(apply.sample) ? null : (
              <TargetPhrase
                text={apply.sample}
                gloss={lineExplain(lesson, locale, apply.sample, guide)}
                explain={lineExplain(lesson, locale, apply.sample, guide)}
                uiLang={UI_SPEECH[locale]}
                lang={lesson.speechLang}
                native={targetName}
                slow={slow}
                onSay={recordTap}
                picture={optionPicture(apply.sample, lesson.vocab, lesson.unitId, locale)}
              />
              )}
              <p
                className="learn-ask-target mt-4 cursor-pointer text-lg leading-8 text-sky-700"
                data-ask={apply.frame}
                onClick={() => {
                  const explain = lineExplain(lesson, locale, apply.sample, guide);
                  if (explain && explain !== apply.sample) {
                    speakQueue([{ text: explain, lang: UI_SPEECH[locale] }, { text: apply.sample, lang: lesson.speechLang }], lesson.speechLang, slow);
                  } else {
                    speakText(apply.sample, lesson.speechLang, slow);
                  }
                  recordTap(apply.sample);
                }}
              >
                {apply.frame}
              </p>
              {guide?.theory.apply[index]?.frame && guide.theory.apply[index].frame !== apply.frame ? (
                <p className="learn-gloss mt-2">
                  {t("inYourLang", { name: localeMeta[locale].native })} {guide.theory.apply[index].frame}
                </p>
              ) : null}
              <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={recordTap} around={apply.sample.split(/[，。,.!?]/)[0]} limit={5} />
            </div>
          ) : null}

          {current === "listen" ? (
            <LessonPodcast
              lesson={lesson}
              locale={locale}
              guide={guide}
              slow={slow}
              heard={heardPodcast}
              shadowRepeats={shadowRepeats}
              onHeard={() => setHeardPodcast(true)}
              onShadow={() => {
                setShadowRepeats((value) => value + 1);
                setHeardPodcast(true);
              }}
              onSay={recordTap}
            />
          ) : null}

          {current === "quotes" && quote ? (
            <FocusCard
              title={reveal ? quote.text : "……"}
              speak={quote.text}
              reading={reveal ? quote.reading : undefined}
              sayVi={reveal ? quote.sayVi : undefined}
              picture={optionPicture(quote.text, lesson.vocab, lesson.unitId, locale)}
              meaning={quote.meaning[locale] && quote.meaning[locale] !== quote.text ? quote.meaning[locale] : undefined}
              locale={locale}
              t={t}
              lang={lesson.speechLang}
              slow={slow}
              lead={t("quotesLead")}
              onTap={recordTap}
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
                unitId={lesson.unitId}
                matchedLabel={t("matched")}
                doneLabel={t("matchDone")}
                lang={lesson.speechLang}
                onTap={say}
                onComplete={() => setGameDone(true)}
              />
            </div>
          ) : null}

          {drill ? (
            <div className="duo-drill mt-5">
              <LinlinTeacher>
                <p data-ask={help?.title} data-explain={help?.blurb || drillPromptHint(drill, lesson, locale, guide)}>
                  {help?.title}
                </p>
                {help?.blurb ? <p className="mt-2 leading-6">{help.blurb}</p> : null}
              </LinlinTeacher>
              {help?.target ? (
                <p className="learn-target mt-3 text-xl font-bold leading-snug text-sky-700" data-ask={help.target}>
                  {help.target}
                </p>
              ) : null}
              <ExerciseField
                exercise={drill}
                lesson={lesson}
                locale={locale}
                value={given}
                disabled={checked}
                showGloss={help?.glossWhen === "always" || (checked && help?.glossWhen === "checked")}
                glossFor={(option) => optionGloss(lesson, locale, option, guide)}
                onAsk={recordTap}
                onChange={(value) => {
                  setAnswers((prev) => ({ ...prev, [drill.id]: value }));
                  if (typeof value !== "string") return;
                  if (isLessonSpeech(lesson, value)) say(value);
                  else recordTap(value);
                }}
              />
              {!checked ? <p className="learn-feedback mt-3 text-sm font-semibold text-ink-soft" data-ask-skip>{t("needAnswer")}</p> : null}
            </div>
          ) : null}
        </div>

        {quizDone ? (
            <div className="learn-actions duo-finish-actions" data-ask-skip>
              <div>
                <p className="text-lg font-extrabold text-ink">{t("sessionDone")}</p>
                <p className="text-sm font-bold text-sky-700">{t("score", { ok: score.ok, total: score.total })} · {t("xpLabel", { xp: xpEarned })}</p>
              </div>
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
            <div className={`learn-actions duo-answer-bar ${checked ? (correct ? "is-right" : "is-wrong") : ""}`} data-ask-skip>
              <div className="duo-answer-copy">
                {checked ? (
                  correct ? (
                    <>
                      <strong>{t("right")}</strong>
                      <span>{t("great")}</span>
                    </>
                  ) : drill ? (
                    <>
                      <strong>{t("almost")}</strong>
                      <span>
                        {t("wrong", {
                          answer: help?.answerGloss
                            ? t("answerWithGloss", {
                                answer: Array.isArray(drill.answer) ? drill.answer.join(" ") : drill.answer,
                                gloss: help.answerGloss,
                              })
                            : Array.isArray(drill.answer)
                              ? drill.answer.join(" ")
                              : drill.answer,
                        })}
                      </span>
                    </>
                  ) : null
                ) : current === "write" && !writingMap[keyOf(step, index)] ? (
                  <span>{t("needWrite")}</span>
                ) : current === "game" && !gameDone ? (
                  <span>{t("needMatch")}</span>
                ) : current === "listen" && !listenReady ? (
                  <span>{t("needShadow", { n: 3 })}</span>
                ) : (
                  <span>{t("lessonProgress", { n: currentItemNumber, total: lessonItemsTotal })}</span>
                )}
              </div>
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
                  {current === "brief"
                    ? t("startNow")
                    : step === steps.length - 1 && index === totalItems - 1
                      ? t("finish")
                      : t("nextItem")}
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
          example: t("tapExample"),
          count: t("tapHistoryCount", { n: history.length }),
        }}
        onClose={() => setHistoryOpen(false)}
        onClear={() => saveTapHistory([])}
      />
      {aiOn && !drawerOpen ? (
        <AskFab
          open={false}
          thinking={thinking}
          count={history.length}
          openLabel={t("tapHistory")}
          closeLabel={t("tapHistoryClose")}
          onToggle={() => setHistoryOpen(true)}
        />
      ) : null}
    </div>
  );
}

function WritingPractice({
  word,
  locale,
  unitId,
  support,
  t,
  lang,
  slow,
  done,
  onSay,
  onDone,
}: {
  word: VocabItem;
  locale: Locale;
  unitId: string;
  support: Locale | null;
  t: ReturnType<typeof useTranslations<"Learn">>;
  lang: string;
  slow: boolean;
  done: boolean;
  onSay: (text: string) => void;
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  function resetCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#23313f";
  }, [word.word]);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function stop() {
    drawing.current = false;
  }

  return (
    <div className="learn-board">
      <p className="learn-kicker">{t("write")}</p>
      <div className="learn-focus-art mb-3">
        <WordPicture emoji={pictureForVocab(word, unitId)} label={word.word} size="lg" />
      </div>
      <div className="duo-write-card">
        <div>
          <button
            type="button"
            className="learn-ask-target text-left text-5xl font-black leading-none text-ink"
            onClick={() => {
              const gloss = support ? word.meaning[support] : undefined;
              if (gloss && gloss !== word.word) {
                speakQueue([{ text: gloss, lang: UI_SPEECH[locale] }, { text: word.word, lang }], lang, slow);
              }
              onSay(word.word);
            }}
          >
            {word.word}
          </button>
          <Phonetic
            reading={word.reading}
            sayVi={word.sayVi}
            locale={locale}
            phoneticLabel={t("phonetic")}
            sayViLabel={t("sayViLabel")}
          />
          {support ? <GlossLine text={word.meaning[support]} /> : null}
          <div className="mt-4">
            <SpeakButton
              text={word.word}
              lang={lang}
              slow={slow}
              label={support ? t("hearBoth") : t("hear")}
              explain={support ? word.meaning[support] : undefined}
              uiLang={UI_SPEECH[locale]}
              onHeard={onSay}
            />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-ink-soft">{t("drawHint")}</p>
          <canvas
            ref={canvasRef}
            className="duo-writing-canvas"
            aria-label={t("drawHint")}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerCancel={stop}
            onPointerLeave={stop}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="duo-secondary-cta" onClick={resetCanvas}>
              {t("clearWriting")}
            </button>
            <button type="button" className="duo-unit-cta" onClick={onDone}>
              {done ? t("done") : t("doneWriting")}
            </button>
          </div>
        </div>
      </div>
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
  picture,
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
  picture?: string;
  locale: Locale;
  t: ReturnType<typeof useTranslations<"Learn">>;
  lang: string;
  slow: boolean;
  onTap?: (text: string) => void;
  onHeard?: (text: string) => void;
}) {
  const hidden = hideText || title === "……";
  const uiLang = UI_SPEECH[locale];
  const hasMeaning = Boolean(meaning && meaning.trim() && meaning.trim() !== speak.trim());

  function play() {
    if (hasMeaning) {
      speakQueue([{ text: meaning!, lang: uiLang }, { text: speak, lang }], lang, slow);
    } else {
      speakText(speak, lang, slow);
    }
    onTap?.(speak);
    onHeard?.(speak);
  }

  return (
    <div className="learn-board">
      {lead ? (
        <p className="mb-3 text-sm leading-6 text-ink-soft" data-ask={speak}>
          {lead}
        </p>
      ) : null}
      {picture ? (
        <div className="learn-focus-art">
          <WordPicture emoji={picture} size="lg" label={title} />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="learn-ask-target min-w-0 text-left" data-ask={speak} onClick={play}>
          <span className="font-display text-3xl font-semibold leading-snug text-sky-700">
            {hidden ? "……" : title}
          </span>
        </button>
        <SpeakButton
          text={speak}
          lang={lang}
          slow={slow}
          label={hasMeaning ? t("hearBoth") : t("hear")}
          explain={hasMeaning ? meaning : undefined}
          uiLang={uiLang}
          onHeard={onHeard}
        />
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
      {meaning ? <GlossLine text={meaning} /> : null}
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

function TheorySlideView({
  slide,
  lesson,
  guide,
  locale,
  t,
  slow,
  onSay,
}: {
  slide: TheorySlide;
  lesson: Lesson;
  guide?: Lesson | null;
  locale: Locale;
  t: ReturnType<typeof useTranslations<"Learn">>;
  slow: boolean;
  onSay: (text: string) => void;
}) {
  const theory = lesson.theory;
  const teacher = teacherTheory(lesson, guide);
  const native = localeMeta[lesson.track].native;
  const uiLang = UI_SPEECH[locale];
  const teacherGoal = pickI18n(lesson.goal, locale, lesson.track);
  const teacherTitle = pickI18n(lesson.title, locale, lesson.track);
  const vocab = lesson.vocab.slice(0, 8);

  function playPair(explain: string | undefined, target: string) {
    if (explain && explain.trim() && explain.trim() !== target.trim()) {
      speakQueue([{ text: explain, lang: uiLang }, { text: target, lang: lesson.speechLang }], lesson.speechLang, slow);
    } else {
      speakText(target, lesson.speechLang, slow);
    }
    onSay(target);
  }

  function phrase(text: string, explain?: string, reading?: string, kicker?: string) {
    if (isCoachCopy(text) || isCoachCopy(explain)) return null;
    const meaning = explain || lineExplain(lesson, locale, text, guide);
    if (isCoachCopy(meaning)) return null;
    return (
      <TargetPhrase
        text={text}
        gloss={meaning}
        reading={reading}
        explain={meaning}
        uiLang={uiLang}
        lang={lesson.speechLang}
        native={native}
        slow={slow}
        onSay={onSay}
        kicker={kicker}
        picture={optionPicture(text, lesson.vocab, lesson.unitId, locale)}
      />
    );
  }

  if (slide.type === "intro") {
    const model =
      theory.patterns.find((item) => !isCoachCopy(item.example))?.example ||
      lesson.sentences.find((item) => isModelUtterance(lesson, item.text))?.text ||
      "";
    const coachTip = isCoachCopy(theory.tip) ? teacher.tip : "";
    return (
      <div className="grid gap-4">
        <UnitScene unitId={lesson.unitId} title={t("inThisScene")} caption={teacherGoal} />
        <LinlinTeacher>
          <p className="font-bold text-ink">{teacherTitle}</p>
          <p className="mt-2 leading-6">{teacherGoal}</p>
          {teacher.levelNote && teacher.levelNote !== teacherGoal ? <p className="mt-2 leading-6">{teacher.levelNote}</p> : null}
          {coachTip ? <p className="mt-2 text-sm leading-6 text-ink-soft">{coachTip}</p> : null}
        </LinlinTeacher>
        {model ? phrase(model, glossOf(lesson, model, locale)) : null}
        {vocab.length ? (
          <div>
            <p className="learn-kicker">{t("todayHear")}</p>
            <VocabStrip
              lesson={lesson}
              locale={locale}
              onSay={(word) => {
                const item = vocab.find((row) => row.word === word);
                playPair(item ? wordGloss(item, locale, lesson.track) : undefined, word);
              }}
            />
          </div>
        ) : null}
        <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={onSay} limit={5} />
      </div>
    );
  }
  if (slide.type === "points") {
    return (
      <div className="grid gap-4">
        <LinlinTeacher>
          <p>{t("rememberThese")}</p>
        </LinlinTeacher>
        <ol className="learn-points">
          {slide.items.map((point, i) => {
            const explain = (teacher.points[i] && !isCoachCopy(teacher.points[i]) ? teacher.points[i] : undefined) || lineExplain(lesson, locale, point, guide);
            const model = isModelUtterance(lesson, point);
            return (
              <li key={`${i}-${point}`} className="learn-point">
                <span className="learn-point-n">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="leading-6 text-ink">{explain && explain !== point ? explain : point}</p>
                  {model ? <div className="mt-2">{phrase(point, explain)}</div> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  if (slide.type === "structure") {
    return (
      <div className="grid gap-4">
        <LinlinTeacher>
          <p>{t("howSentence")}</p>
          <p className="mt-2 leading-6">{teacher.structure}</p>
        </LinlinTeacher>
      </div>
    );
  }
  if (slide.type === "pattern") {
    const pattern = slide.pattern;
    const patternIndex = theory.patterns.findIndex((item) => item.example === pattern.example && item.form === pattern.form);
    const guided = patternIndex >= 0 ? guide?.theory.patterns[patternIndex] : undefined;
    const note = guided?.note && !isCoachCopy(guided.note) ? guided.note : undefined;
    return (
      <div className="grid gap-4">
        <LinlinTeacher>
          <p>{t("pattern")}</p>
          {guided?.use && !isCoachCopy(guided.use) ? <p className="mt-2 leading-6">{guided.use}</p> : null}
          {note && note !== guided?.use ? <p className="mt-2 leading-6">{note}</p> : null}
        </LinlinTeacher>
        {isCoachCopy(pattern.example) ? null : phrase(pattern.example, glossOf(lesson, pattern.example, locale))}
        {pattern.form && !isCoachCopy(pattern.form) ? <p className="text-sm font-semibold text-sky-700">{pattern.form}</p> : null}
        <ExampleBank lesson={lesson} locale={locale} slow={slow} onSay={onSay} around={pattern.example} limit={4} />
      </div>
    );
  }
  if (slide.type === "list") {
    const source =
      slide.titleKey === "contrasts"
        ? theory.contrasts
        : slide.titleKey === "mistakes"
          ? theory.mistakes
          : slide.titleKey === "usage"
            ? theory.usage
            : theory.examples;
    const guidedSource =
      slide.titleKey === "contrasts"
        ? guide?.theory.contrasts
        : slide.titleKey === "mistakes"
          ? guide?.theory.mistakes
          : slide.titleKey === "usage"
            ? guide?.theory.usage
            : guide?.theory.examples;
    return (
      <div className="grid gap-4">
        <LinlinTeacher>
          <p>{t(slide.titleKey)}</p>
        </LinlinTeacher>
        <ul className="mt-1 grid gap-2">
          {slide.items.map((row, i) => {
            const explain = glossOf(lesson, row, locale) || pairByValue(source, guidedSource, row) || guidedSource?.[i];
            const model = isModelUtterance(lesson, row);
            if (isCoachCopy(row) || isCoachCopy(explain)) return null;
            if (slide.titleKey === "examples" && !model) return null;
            return model ? (
              <li key={`${i}-${row}`}>{phrase(row, explain)}</li>
            ) : (
              <li key={`${i}-${row}`} className="learn-point">
                <span className="learn-point-n">{i + 1}</span>
                <p className="min-w-0 flex-1 leading-6 text-ink">{explain && explain !== row ? explain : row}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  if (slide.type === "table") {
    return (
      <SlideShell kicker={t("swapTable")} title={teacher.table.title || theory.table.title} explain={teacher.table.rows.slice(0, 3).join(" · ")}>
        <ul className="learn-swap">
          {theory.table.rows.slice(0, 8).map((row, index) => {
            const [left, right] = row.split(" → ");
            const explained = guide?.theory.table.rows[index];
            return (
              <li key={row} className="learn-swap-row">
                <div>
                  <button type="button" className="font-semibold text-sky-700" onClick={() => playPair(explained, left || row)}>
                    {left || row}
                  </button>
                  {explained && explained !== row ? <p className="learn-gloss mt-1">{explained}</p> : null}
                </div>
                {right ? (
                  <button type="button" className="text-left text-sm text-ink-soft" onClick={() => playPair(explained, right)}>
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
    <div className="grid gap-4">
      <LinlinTeacher>
        <p>{t("keepThis")}</p>
        <p className="mt-2 leading-6">{teacher.tip}</p>
      </LinlinTeacher>
    </div>
  );
}

function ExerciseField({
  exercise,
  lesson,
  locale,
  value,
  disabled,
  showGloss,
  glossFor,
  onChange,
  onAsk,
}: {
  exercise: Exercise;
  lesson?: Lesson;
  locale?: Locale;
  value: string | string[] | undefined;
  disabled: boolean;
  showGloss?: boolean;
  glossFor?: (option: string) => string | undefined;
  onChange: (value: string | string[]) => void;
  onAsk?: (text: string) => void;
}) {
  if (exercise.type === "mcq") {
    const pictured = Boolean(lesson && locale && exercise.options.every((option) => option.length <= 32));
    return (
      <div className={pictured ? "learn-option-grid" : "mt-3 grid gap-2"}>
        {exercise.options.map((option) => {
          const selected = value === option;
          const right = disabled && option === exercise.answer;
          const wrong = disabled && selected && option !== exercise.answer;
          const gloss = showGloss ? glossFor?.(option) : undefined;
          const emoji = pictured && lesson && locale ? optionPicture(option, lesson.vocab, lesson.unitId, locale) : undefined;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              className={`learn-option ${pictured ? "is-pic" : ""} ${right ? "is-right" : ""} ${wrong ? "is-wrong" : ""} ${selected ? "is-selected" : ""}`}
            >
              {emoji ? <WordPicture emoji={emoji} size="md" label={option} /> : null}
              <span className="block">{option}</span>
              {gloss && gloss !== option ? <small className="learn-option-gloss">{gloss}</small> : null}
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
        className="learn-input"
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
      <div className="learn-token-answer">
        {chosen.length ? (
          chosen.map((token, i) => (
            <button
              key={`${token}-${i}`}
              type="button"
              disabled={disabled}
              className="learn-token is-picked"
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
            className="learn-token"
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
