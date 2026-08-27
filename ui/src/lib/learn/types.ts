import type { Locale } from "@/i18n/routing";

export type LearnTrack = Locale;

export type I18nText = Record<Locale, string>;

export type VocabItem = {
  word: string;
  reading: string;
  sayVi: string;
  meaning: I18nText;
  usage?: string;
};

export type QuoteItem = {
  text: string;
  reading: string;
  sayVi: string;
  meaning: I18nText;
};

export type GrammarPattern = {
  form: string;
  use: string;
  example: string;
  note: string;
};

export type ApplyItem = {
  prompt: string;
  frame: string;
  sample: string;
};

export type LessonTheory = {
  levelTitle: string;
  levelNote: string;
  points: string[];
  structure: string;
  patterns: GrammarPattern[];
  usage: string[];
  apply: ApplyItem[];
  tip: string;
  contrasts: string[];
  mistakes: string[];
  examples: string[];
  table: { title: string; rows: string[] };
};

export type SentenceItem = {
  text: string;
  reading: string;
  sayVi: string;
  meaning: I18nText;
  tokens: string[];
};

export type Exercise =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      promptKey?: "whichLine" | "whichFits" | "whichSentence" | "whichPattern";
      promptI18n?: I18nText;
      options: string[];
      answer: string;
    }
  | { id: string; type: "gap"; prompt: string; answer: string }
  | { id: string; type: "order"; prompt: I18nText | string; tokens: string[]; answer: string[] };

export type Lesson = {
  id: string;
  track: LearnTrack;
  unitId: string;
  level: string;
  kind: "teach" | "words" | "review" | "listen" | "drill" | "practice" | "play";
  order: number;
  minutes: number;
  title: I18nText;
  goal: I18nText;
  speechLang: string;
  theory: LessonTheory;
  vocab: VocabItem[];
  sentences: SentenceItem[];
  quotes: QuoteItem[];
  listening: { text: string; lines: string[] };
  exercises: Exercise[];
};

export type CatalogTrack = {
  id: LearnTrack;
  lessonCount: number;
  exerciseCount: number;
  units: { id: string; level: string; title: I18nText; goal?: I18nText; lessonIds: string[] }[];
};

export type Catalog = {
  generatedAt: string;
  note: string;
  tracks: CatalogTrack[];
};

export function isLearnTrack(value: string): value is LearnTrack {
  return value === "vi" || value === "en" || value === "zh" || value === "th";
}
