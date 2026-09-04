import type { Locale } from "@/i18n/routing";
import { UI_SPEECH, glossOf, pickI18n, wordGloss } from "@/lib/learn/language";
import type { Lesson, SentenceItem } from "@/lib/learn/types";

export type SpeechPart = { text: string; lang: string };

export const CHAPTER_SPINE = ["teach", "words", "listen", "practice", "play"] as const;

export const KIND_STEP_KEY = {
  teach: "stepTeach",
  words: "stepWords",
  listen: "stepListen",
  practice: "stepPractice",
  play: "stepPlay",
} as const;

export const KIND_CRITERIA = {
  teach: ["criteriaTeach1", "criteriaTeach2", "criteriaTeach3"],
  words: ["criteriaWords1", "criteriaWords2", "criteriaWords3"],
  listen: ["criteriaListen1", "criteriaListen2", "criteriaListen3"],
  practice: ["criteriaPractice1", "criteriaPractice2", "criteriaPractice3"],
  play: ["criteriaPlay1", "criteriaPlay2", "criteriaPlay3"],
  review: ["criteriaWords1", "criteriaWords2", "criteriaPlay3"],
  drill: ["criteriaTeach1", "criteriaTeach2", "criteriaPractice3"],
} as const;

export const STEP_COACH = {
  brief: "coachBrief",
  theory: "coachTheory",
  words: "coachWords",
  recognize: "coachRecognize",
  write: "coachWrite",
  listen: "coachListen",
  apply: "coachApply",
  quotes: "coachQuotes",
  game: "coachGame",
  quiz: "coachQuiz",
  lines: "coachQuotes",
} as const;

export function spineIndex(kind: Lesson["kind"]) {
  const index = CHAPTER_SPINE.indexOf(kind as (typeof CHAPTER_SPINE)[number]);
  return index >= 0 ? index : 0;
}

const COACH_COPY =
  /bấm loa|use the speaker|press the speaker|hear the speaker|click the speaker|喇叭|点喇叭|不认识字|还不认识|chưa đọc được|cannot read|if you cannot read|อ่านไม่ได้|กดลำโพง|nếu chưa đọc|不必写|写得好看|只练读音|chưa cần viết|needn't write|don't need to write nicely/i;

export function isCoachCopy(text: string | undefined): boolean {
  return Boolean(text && COACH_COPY.test(text.trim()));
}

export function isModelUtterance(lesson: Lesson, text: string | undefined): boolean {
  const needle = (text || "").replace(/\s+/g, " ").trim();
  if (!needle || isCoachCopy(needle)) return false;
  if (lesson.vocab.some((item) => item.word.trim() === needle)) return true;
  if (lesson.sentences.some((item) => item.text.trim() === needle)) return true;
  if ((lesson.quotes || []).some((item) => item.text.trim() === needle)) return true;
  if (lesson.theory.apply.some((item) => item.sample.trim() === needle)) return true;
  if (lesson.listening.lines.some((item) => item.trim() === needle)) return true;
  return false;
}

export function pairByValue(target: string[] | undefined, guide: string[] | undefined, value: string): string | undefined {
  if (!target?.length || !guide?.length) return undefined;
  const index = target.findIndex((row) => row.trim() === value.trim());
  if (index < 0) return undefined;
  const text = guide[index]?.trim();
  if (!text || text === value.trim()) return undefined;
  return text;
}

export function dualChunks(explain: string | undefined, target: string, uiLang: string, speechLang: string): SpeechPart[] {
  const parts: SpeechPart[] = [];
  const cleanExplain = explain?.replace(/。{2,}/g, "。").trim();
  const cleanTarget = target.replace(/。{2,}/g, "。").trim();
  if (cleanTarget && !isCoachCopy(cleanTarget)) parts.push({ text: cleanTarget, lang: speechLang });
  if (cleanExplain && cleanExplain !== cleanTarget && !isCoachCopy(cleanExplain)) {
    parts.push({ text: cleanExplain, lang: uiLang });
  }
  return parts;
}

export function teacherTheory(lesson: Lesson, guide?: Lesson | null) {
  return (guide || lesson).theory;
}

export function lineExplain(lesson: Lesson, locale: Locale, text: string, guide?: Lesson | null): string | undefined {
  const gloss = glossOf(lesson, text, locale);
  if (gloss && !isCoachCopy(gloss)) return gloss;
  const paired =
    pairByValue(lesson.listening.lines, guide?.listening.lines, text) ||
    pairByValue(
      lesson.sentences.map((item) => item.text),
      guide?.sentences.map((item) => item.text),
      text,
    ) ||
    pairByValue(lesson.theory.points, guide?.theory.points, text) ||
    pairByValue(lesson.theory.examples, guide?.theory.examples, text) ||
    pairByValue(lesson.theory.usage, guide?.theory.usage, text) ||
    pairByValue(lesson.theory.contrasts, guide?.theory.contrasts, text) ||
    pairByValue(lesson.theory.mistakes, guide?.theory.mistakes, text);
  if (!paired || isCoachCopy(paired)) return undefined;
  return paired;
}

export function lectureChunks(lesson: Lesson, locale: Locale, guide?: Lesson | null): SpeechPart[] {
  const uiLang = UI_SPEECH[locale];
  const goal = pickI18n(lesson.goal, locale, lesson.track);
  const note = teacherTheory(lesson, guide).levelNote;
  const chunks: SpeechPart[] = [];
  if (goal) chunks.push({ text: goal, lang: uiLang });
  if (note && note.trim() !== goal.trim()) chunks.push({ text: note, lang: uiLang });
  for (const item of lesson.vocab.slice(0, 4)) {
    chunks.push(...dualChunks(wordGloss(item, locale, lesson.track), item.word, uiLang, lesson.speechLang));
  }
  for (const sentence of lesson.sentences.slice(0, 3)) {
    if (isCoachCopy(sentence.text) || isCoachCopy(sentence.meaning[locale])) continue;
    chunks.push(...dualChunks(sentence.meaning[locale], sentence.text, uiLang, lesson.speechLang));
  }
  return chunks;
}

export function slideSpeech(
  lesson: Lesson,
  locale: Locale,
  slide: {
    type: string;
    items?: string[];
    titleKey?: "contrasts" | "mistakes" | "usage" | "examples";
    pattern?: { form: string; use: string; example: string; note: string };
  },
  guide?: Lesson | null,
): SpeechPart[] {
  const uiLang = UI_SPEECH[locale];
  const goal = pickI18n(lesson.goal, locale, lesson.track);
  const teacher = teacherTheory(lesson, guide);
  if (slide.type === "intro") return lectureChunks(lesson, locale, guide);
  if (slide.type === "points") {
    return (slide.items || []).flatMap((item) => {
      const explain = lineExplain(lesson, locale, item, guide);
      if (isModelUtterance(lesson, item)) return dualChunks(explain, item, uiLang, lesson.speechLang);
      return explain && !isCoachCopy(explain) ? [{ text: explain, lang: uiLang }] : [];
    });
  }
  if (slide.type === "structure") {
    return teacher.structure ? [{ text: teacher.structure, lang: uiLang }] : [];
  }
  if (slide.type === "pattern" && slide.pattern) {
    const index = lesson.theory.patterns.findIndex(
      (item) => item.example === slide.pattern?.example && item.form === slide.pattern.form,
    );
    const guided = index >= 0 ? guide?.theory.patterns[index] : undefined;
    const example = slide.pattern.example;
    const chunks: SpeechPart[] = [];
    if (guided?.use && !isCoachCopy(guided.use)) chunks.push({ text: guided.use, lang: uiLang });
    if (guided?.note && guided.note !== guided.use && !isCoachCopy(guided.note)) chunks.push({ text: guided.note, lang: uiLang });
    if (!isCoachCopy(example)) chunks.push(...dualChunks(glossOf(lesson, example, locale), example, uiLang, lesson.speechLang));
    return chunks;
  }
  if (slide.type === "list") {
    const source =
      slide.titleKey === "contrasts"
        ? lesson.theory.contrasts
        : slide.titleKey === "mistakes"
          ? lesson.theory.mistakes
          : slide.titleKey === "usage"
            ? lesson.theory.usage
            : lesson.theory.examples;
    const guided =
      slide.titleKey === "contrasts"
        ? guide?.theory.contrasts
        : slide.titleKey === "mistakes"
          ? guide?.theory.mistakes
          : slide.titleKey === "usage"
            ? guide?.theory.usage
            : guide?.theory.examples;
    return (slide.items || []).slice(0, 4).flatMap((item) => {
      const explain = glossOf(lesson, item, locale) || pairByValue(source, guided, item);
      if (slide.titleKey === "examples" || isModelUtterance(lesson, item)) {
        return dualChunks(explain, item, uiLang, lesson.speechLang);
      }
      return explain && !isCoachCopy(explain) ? [{ text: explain, lang: uiLang }] : [];
    });
  }
  if (slide.type === "tip") {
    return teacher.tip ? [{ text: teacher.tip, lang: uiLang }] : [];
  }
  if (slide.type === "table" && lesson.theory.table?.rows?.length) {
    return lesson.theory.table.rows
      .slice(0, 4)
      .flatMap((row, index) => dualChunks(guide?.theory.table.rows[index], row, uiLang, lesson.speechLang));
  }
  return goal ? [{ text: goal, lang: uiLang }] : [];
}

export function podcastLines(lesson: Lesson): string[] {
  const lines = lesson.listening.lines
    .map((item) => item.replace(/。{2,}/g, "。").trim())
    .filter((item) => item && !isCoachCopy(item));
  if (lines.length) return lines.slice(0, 8);
  return lesson.listening.text
    .replace(/。{2,}/g, "。")
    .split(/[。.!?\n]/)
    .map((item) => item.trim())
    .filter((item) => item && !isCoachCopy(item))
    .slice(0, 8);
}

export function podcastSpeech(
  lesson: Lesson,
  locale: Locale,
  guide?: Lesson | null,
): { chunks: SpeechPart[]; lineOf: (chunkIndex: number) => number } {
  const uiLang = UI_SPEECH[locale];
  const lines = podcastLines(lesson);
  const chunks: SpeechPart[] = [];
  const map: number[] = [];
  const note = teacherTheory(lesson, guide).levelNote;
  if (note) {
    chunks.push({ text: note, lang: uiLang });
    map.push(-1);
  }
  lines.forEach((line, index) => {
    const explain = lineExplain(lesson, locale, line, guide);
    dualChunks(explain, line, uiLang, lesson.speechLang).forEach((chunk) => {
      chunks.push(chunk);
      map.push(index);
    });
  });
  return { chunks, lineOf: (chunkIndex: number) => map[chunkIndex] ?? -1 };
}

export function relatedSentences(lesson: Lesson, locale: Locale, around?: string, limit = 5): SentenceItem[] {
  const rows = lesson.sentences.filter(
    (item) => item.text.trim() && !isCoachCopy(item.text) && !isCoachCopy(item.meaning[locale]),
  );
  if (!around?.trim()) return rows.slice(0, limit);
  const needle = around.trim();
  const score = (item: SentenceItem) => {
    let n = 0;
    if (item.text.includes(needle)) n += 6;
    if (item.tokens?.some((token) => token === needle || needle.includes(token))) n += 5;
    if (Object.values(item.meaning).some((value) => value.includes(needle))) n += 3;
    return n;
  };
  return [...rows].sort((a, b) => score(b) - score(a) || rows.indexOf(a) - rows.indexOf(b)).slice(0, limit);
}
