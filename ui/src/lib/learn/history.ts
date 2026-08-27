import type { Locale } from "@/i18n/routing";
import type { Lesson } from "@/lib/learn/types";

export const TAP_HISTORY_KEY = "linlin-tap-history";
export const TAP_HISTORY_MAX = 50;

export type TapRecord = {
  id: string;
  ask: string;
  prompt: string;
  answer?: string;
  lang: string;
  track: string;
  locale: Locale;
  lessonId?: string;
  unitId?: string;
  kind?: string;
  reading?: string;
  sayVi?: string;
  translation?: string;
  explain?: string;
  source: "lookup" | "pending";
  at: number;
  /** @deprecated use ask — kept so old localStorage rows still load */
  text?: string;
};

function asRecord(row: TapRecord): TapRecord {
  const ask = (row.ask || row.text || "").trim();
  return {
    ...row,
    ask,
    text: ask,
    prompt: row.prompt || ask,
    source: row.source || "lookup",
  };
}

function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function tapId(track: string, text: string) {
  return `${track}:${norm(text)}`;
}

export function loadTapHistory(): TapRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TAP_HISTORY_KEY);
    const rows = raw ? (JSON.parse(raw) as TapRecord[]) : [];
    return Array.isArray(rows) ? rows.map(asRecord).slice(0, TAP_HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

export function saveTapHistory(items: TapRecord[]) {
  const next = items.slice(0, TAP_HISTORY_MAX);
  cache = next;
  localStorage.setItem(TAP_HISTORY_KEY, JSON.stringify(next));
  listeners.forEach((listen) => listen());
}

const listeners = new Set<() => void>();
let cache: TapRecord[] | null = null;

export function subscribeTapHistory(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getTapHistory(): TapRecord[] {
  if (typeof window === "undefined") return [];
  if (!cache) cache = loadTapHistory();
  return cache;
}

const EMPTY_HISTORY: TapRecord[] = [];

export function getTapHistoryServer(): TapRecord[] {
  return EMPTY_HISTORY;
}

export function pushTapRecord(items: TapRecord[], incoming: Omit<TapRecord, "id" | "at">): TapRecord[] {
  const ask = (incoming.ask || incoming.text || "").trim();
  if (!ask) return items;
  const id = tapId(incoming.track, ask);
  const next: TapRecord = asRecord({ ...incoming, ask, text: ask, id, at: Date.now() });
  return [next, ...items.filter((item) => item.id !== id)].slice(0, TAP_HISTORY_MAX);
}

export function buildAskPrompt(lesson: Lesson, ask: string, locale: Locale) {
  const ui = { vi: "tiếng Việt", en: "English", zh: "中文", th: "ไทย" };
  const learn = { vi: "tiếng Việt", en: "English", zh: "中文", th: "ไทย" };
  return [
    `Người học đang học ${learn[lesson.track]}, giao diện ${ui[locale]}.`,
    `Bài: ${lesson.title[locale] || lesson.title[lesson.track]} · ${lesson.kind} · ${lesson.level}.`,
    `Họ bấm vào: 「${ask}」.`,
    `Hãy trả lời ngắn như giáo viên: phiên âm nếu cần, dịch sang ${ui[locale]}, và giải thích từ/câu này dùng khi nào.`,
  ].join(" ");
}

export function isLessonSpeech(lesson: Lesson, text: string) {
  const needle = norm(text);
  if (!needle) return false;
  if (lesson.vocab.some((item) => norm(item.word) === needle)) return true;
  if (lesson.sentences.some((item) => norm(item.text) === needle)) return true;
  if ((lesson.quotes || []).some((item) => norm(item.text) === needle)) return true;
  if (lesson.theory.patterns.some((item) => norm(item.example) === needle || norm(item.form) === needle)) return true;
  if (lesson.theory.apply.some((item) => norm(item.sample) === needle)) return true;
  if (lesson.listening.lines.some((item) => norm(item) === needle)) return true;
  if (norm(lesson.listening.text) === needle) return true;
  return false;
}

function pickMeaning(meaning: Record<Locale, string> | undefined, locale: Locale, track: string) {
  if (!meaning) return undefined;
  if (locale === track) return undefined;
  return meaning[locale] || undefined;
}

export function lookupTap(
  lesson: Lesson,
  text: string,
  locale: Locale,
): Pick<TapRecord, "reading" | "sayVi" | "translation" | "explain" | "answer"> {
  const needle = norm(text);
  const goal = lesson.goal[locale] || lesson.goal[lesson.track];

  const word = lesson.vocab.find((item) => norm(item.word) === needle);
  if (word) {
    return {
      reading: word.reading || undefined,
      sayVi: word.sayVi || undefined,
      translation: pickMeaning(word.meaning, locale, lesson.track),
      explain: word.usage || goal,
    };
  }

  const line = [...lesson.sentences, ...(lesson.quotes || [])].find((item) => norm(item.text) === needle);
  if (line) {
    return {
      reading: line.reading || undefined,
      sayVi: line.sayVi || undefined,
      translation: pickMeaning(line.meaning, locale, lesson.track),
      explain: goal,
    };
  }

  const pattern = lesson.theory.patterns.find(
    (item) => norm(item.example) === needle || norm(item.form) === needle,
  );
  if (pattern) {
    return {
      translation: locale === lesson.track ? undefined : pattern.use,
      explain: pattern.note || pattern.use || goal,
    };
  }

  const apply = lesson.theory.apply.find((item) => norm(item.sample) === needle || norm(item.frame) === needle);
  if (apply) {
    return {
      translation: locale === lesson.track ? undefined : apply.prompt,
      explain: apply.prompt || goal,
    };
  }

  for (const row of lesson.theory.table?.rows || []) {
    const [left, right] = row.split(" → ");
    if (left && norm(left) === needle) {
      const hit = lesson.vocab.find((item) => norm(item.word) === needle);
      return {
        translation: pickMeaning(hit?.meaning, locale, lesson.track),
        explain: right || hit?.usage || goal,
        reading: hit?.reading,
        sayVi: hit?.sayVi,
      };
    }
    if (right && norm(right) === needle) {
      const hit = lesson.sentences.find((item) => norm(item.text) === needle);
      return {
        translation: pickMeaning(hit?.meaning, locale, lesson.track),
        explain: goal,
        reading: hit?.reading,
        sayVi: hit?.sayVi,
      };
    }
  }

  const listenHit = lesson.sentences.find((item) => needle.includes(norm(item.text)) || norm(item.text).includes(needle));
  if (listenHit && (norm(lesson.listening.text) === needle || lesson.listening.lines.some((line) => norm(line) === needle))) {
    return {
      translation: pickMeaning(listenHit.meaning, locale, lesson.track),
      explain: goal,
      reading: listenHit.reading,
      sayVi: listenHit.sayVi,
    };
  }

  return { explain: goal };
}
