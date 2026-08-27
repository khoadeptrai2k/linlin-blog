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

export function clipAsk(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned === "……" || cleaned === "…" || cleaned === "?") return "";
  if (cleaned.length < 2) return "";
  if (cleaned.length <= 220) return cleaned;
  return `${cleaned.slice(0, 217).trim()}…`;
}

function firstAskLine(hit: Element) {
  const data = hit.getAttribute("data-ask");
  if (data?.trim()) return clipAsk(data);
  const primary = hit.querySelector(
    ":scope > .font-display, :scope > .font-semibold, :scope span.font-display, :scope span.font-semibold, :scope > span:first-child",
  );
  if (primary?.textContent) {
    const line = clipAsk(primary.textContent);
    if (line) return line;
  }
  return clipAsk(hit.textContent || "");
}

export function explainFromLessonClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return "";
  const node = target.closest("[data-explain]");
  return (node?.getAttribute("data-explain") || "").trim();
}

export function textFromLessonClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return "";
  if (
    target.closest(
      "[data-ask-skip], .learn-actions, .learn-speak, .learn-speed, .learn-ask-fab, .learn-history, .learn-rail, .btn-primary, .btn-ghost, input, textarea, a",
    )
  ) {
    return "";
  }

  const dataNode = target.closest("[data-ask]");
  if (dataNode) {
    const value = clipAsk(dataNode.getAttribute("data-ask") || "");
    if (value) return value;
  }

  if (
    target.classList.contains("learn-card") ||
    target.classList.contains("learn-stage") ||
    target.classList.contains("learn-card-head") ||
    target.classList.contains("learn-board") ||
    target.classList.contains("learn-chip-row") ||
    target.classList.contains("learn-points") ||
    target.classList.contains("learn-swap")
  ) {
    return "";
  }

  const pointNum = target.closest(".learn-point-n");
  if (pointNum) {
    const button = pointNum.closest(".learn-point")?.querySelector("button");
    if (button) return firstAskLine(button);
  }

  const kicker = target.closest(".learn-kicker");
  if (kicker?.parentElement) {
    const body = kicker.parentElement.querySelector("p:not(.learn-kicker), h2, h1");
    if (body) {
      const line = firstAskLine(body);
      if (line) return line;
    }
  }

  const hit = target.closest("h1, h2, h3, button, p, label, li, .learn-chip, .learn-goal, .learn-board-title");
  if (!(hit instanceof Element)) return "";
  if (
    hit.closest("[data-ask-skip], .learn-actions, .learn-speak, .learn-speed, .btn-primary, .btn-ghost")
  ) {
    return "";
  }
  return firstAskLine(hit);
}

export function isLessonSpeech(lesson: Lesson, text: string) {
  const needle = norm(text);
  if (!needle) return false;
  if (norm(lesson.title[lesson.track]) === needle) return true;
  if (norm(lesson.theory.levelTitle) === needle) return true;
  if (lesson.vocab.some((item) => norm(item.word) === needle)) return true;
  if (lesson.sentences.some((item) => norm(item.text) === needle)) return true;
  if ((lesson.quotes || []).some((item) => norm(item.text) === needle)) return true;
  if (lesson.theory.points.some((item) => norm(item) === needle)) return true;
  if (norm(lesson.theory.structure) === needle) return true;
  if (norm(lesson.theory.tip) === needle) return true;
  if (lesson.theory.examples.some((item) => norm(item) === needle)) return true;
  if (lesson.theory.patterns.some((item) => norm(item.example) === needle || norm(item.form) === needle)) return true;
  if (lesson.theory.apply.some((item) => norm(item.sample) === needle)) return true;
  if (lesson.theory.table.rows.some((row) => row.split(" → ").some((cell) => cell && norm(cell) === needle))) return true;
  if (lesson.listening.lines.some((item) => norm(item) === needle)) return true;
  if (norm(lesson.listening.text) === needle) return true;
  return false;
}

function pickMeaning(meaning: Record<Locale, string> | undefined, locale: Locale, track: string) {
  if (!meaning) return undefined;
  if (locale === track) return undefined;
  return meaning[locale] || undefined;
}

function meaningHit(meaning: Record<Locale, string> | undefined, needle: string) {
  return Boolean(meaning && Object.values(meaning).some((value) => value && norm(value) === needle));
}

function vocabFromAsk(lesson: Lesson, needle: string) {
  const exact = lesson.vocab.find((item) => norm(item.word) === needle);
  if (exact) return exact;
  const byMeaning = lesson.vocab.find((item) => meaningHit(item.meaning, needle));
  if (byMeaning) return byMeaning;
  return lesson.vocab.find((item) => {
    const word = norm(item.word);
    if (!word) return false;
    const cjkOrThai = /[\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF]/.test(word);
    if (cjkOrThai) return needle.includes(word);
    if (word.length < 3) return false;
    return needle.includes(word);
  });
}

function lineFromAsk(lesson: Lesson, needle: string) {
  const rows = [...lesson.sentences, ...(lesson.quotes || [])];
  const exact = rows.find((item) => norm(item.text) === needle);
  if (exact) return exact;
  const byMeaning = rows.find((item) => meaningHit(item.meaning, needle));
  if (byMeaning) return byMeaning;
  return rows.find((item) => {
    const line = norm(item.text);
    return line.length >= 4 && (needle.includes(line) || line.includes(needle));
  });
}

export function lookupTap(
  lesson: Lesson,
  text: string,
  locale: Locale,
): Pick<TapRecord, "reading" | "sayVi" | "translation" | "explain" | "answer"> {
  const needle = norm(text);
  const goal = lesson.goal[locale] || lesson.goal[lesson.track];
  const trackTitle = lesson.title[lesson.track];
  const { theory } = lesson;
  const note = theory.levelNote || goal;

  if (norm(trackTitle) === needle) {
    return {
      translation: locale === lesson.track ? undefined : lesson.title[locale] || undefined,
      explain: note,
    };
  }
  if (Object.values(lesson.title).some((value) => value && norm(value) === needle)) {
    return { translation: trackTitle, explain: note };
  }
  if (Object.values(lesson.goal).some((value) => value && norm(value) === needle) || norm(theory.levelTitle) === needle) {
    return { explain: note };
  }
  if (norm(theory.levelNote) === needle) {
    return { explain: goal };
  }

  const word = vocabFromAsk(lesson, needle);
  if (word) {
    const askedWord = norm(word.word) === needle || needle.includes(norm(word.word));
    return {
      reading: word.reading || undefined,
      sayVi: word.sayVi || undefined,
      translation: askedWord ? pickMeaning(word.meaning, locale, lesson.track) : word.word,
      explain: word.usage || note,
    };
  }

  const line = lineFromAsk(lesson, needle);
  if (line) {
    return {
      reading: line.reading || undefined,
      sayVi: line.sayVi || undefined,
      translation: norm(line.text) === needle ? pickMeaning(line.meaning, locale, lesson.track) : line.text,
      explain: note,
    };
  }

  const pattern = theory.patterns.find(
    (item) =>
      norm(item.example) === needle ||
      norm(item.form) === needle ||
      norm(item.use) === needle ||
      norm(item.note) === needle,
  );
  if (pattern) {
    return {
      translation: locale === lesson.track ? undefined : pattern.use,
      explain: [pattern.form, pattern.note || pattern.use].filter(Boolean).join(" · ") || note,
    };
  }

  const apply = theory.apply.find(
    (item) => norm(item.sample) === needle || norm(item.frame) === needle || norm(item.prompt) === needle,
  );
  if (apply) {
    return {
      translation: locale === lesson.track ? undefined : apply.sample,
      explain: `${apply.prompt} ${apply.frame} → ${apply.sample}`.trim(),
    };
  }

  const point =
    theory.points.find((item) => norm(item) === needle) ||
    theory.usage.find((item) => norm(item) === needle) ||
    theory.contrasts.find((item) => norm(item) === needle) ||
    theory.mistakes.find((item) => norm(item) === needle) ||
    theory.examples.find((item) => norm(item) === needle);
  if (point) {
    return { explain: note };
  }

  if (norm(theory.structure) === needle) {
    return { explain: note };
  }
  if (norm(theory.tip) === needle) {
    return { explain: note };
  }
  if (norm(theory.table.title) === needle) {
    return { explain: theory.table.rows.slice(0, 3).join(" · ") || note };
  }

  for (const row of theory.table?.rows || []) {
    const [left, right] = row.split(" → ");
    if (left && norm(left) === needle) {
      const hit = lesson.vocab.find((item) => norm(item.word) === needle);
      return {
        translation: pickMeaning(hit?.meaning, locale, lesson.track),
        explain: right || hit?.usage || note,
        reading: hit?.reading,
        sayVi: hit?.sayVi,
      };
    }
    if (right && norm(right) === needle) {
      const hit = lesson.sentences.find((item) => norm(item.text) === needle);
      return {
        translation: pickMeaning(hit?.meaning, locale, lesson.track),
        explain: note,
        reading: hit?.reading,
        sayVi: hit?.sayVi,
      };
    }
  }

  const listenHit = lesson.sentences.find((item) => needle.includes(norm(item.text)) || norm(item.text).includes(needle));
  if (listenHit && (norm(lesson.listening.text) === needle || lesson.listening.lines.some((row) => norm(row) === needle))) {
    return {
      translation: pickMeaning(listenHit.meaning, locale, lesson.track),
      explain: note,
      reading: listenHit.reading,
      sayVi: listenHit.sayVi,
    };
  }

  return { explain: goal };
}
