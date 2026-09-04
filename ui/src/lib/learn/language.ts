import type { Locale } from "@/i18n/routing";
import type { I18nText, Lesson } from "@/lib/learn/types";

export const UI_SPEECH: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  th: "th-TH",
};

const LANG_ALIAS: Record<string, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  th: "th-TH",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  "zh-hk": "zh-HK",
  "en-us": "en-US",
  "en-gb": "en-GB",
  "vi-vn": "vi-VN",
  "th-th": "th-TH",
};

export function resolveSpeechLang(lang?: string, track?: string) {
  const raw = (lang || "").replace("_", "-").trim();
  if (raw) {
    const mapped = LANG_ALIAS[raw.toLowerCase()];
    if (mapped) return mapped;
    if (/^[a-z]{2}(-[a-z]{2,})?$/i.test(raw)) return raw;
  }
  const fromTrack = LANG_ALIAS[(track || "").toLowerCase()];
  return fromTrack || UI_SPEECH.en;
}

export function pickI18n(text: I18nText | undefined, locale: Locale, track: Locale) {
  if (!text) return "";
  return (text[locale] || text[track] || Object.values(text).find(Boolean) || "").trim();
}

export function targetLine(text: I18nText | undefined, track: Locale) {
  if (!text) return "";
  return (text[track] || "").trim();
}

export function compactLearn(text: string) {
  return text.replace(/\s+/g, "").replace(/[。！？，、.…·!?,'"“”‘’：:()（）]/g, "");
}

export function fillCloze(prompt: string, answer: string) {
  return prompt.replace(/_{2,}|____/g, answer).replace(/\s+/g, " ").trim();
}

export function glossOf(lesson: Lesson, text: string, locale: Locale): string | undefined {
  const needle = text.replace(/\s+/g, " ").trim();
  if (!needle) return undefined;
  const line =
    lesson.sentences.find((item) => item.text.trim() === needle) ||
    (lesson.quotes || []).find((item) => item.text.trim() === needle);
  const fromLine = line?.meaning[locale]?.trim();
  if (fromLine && fromLine !== needle) return fromLine;
  const word = lesson.vocab.find((item) => item.word.trim() === needle);
  const fromWord = word?.meaning[locale]?.trim();
  if (fromWord && fromWord !== needle) return fromWord;
  return undefined;
}

export function sentenceGloss(lesson: Lesson, locale: Locale, text: string): string | undefined {
  const exact = glossOf(lesson, text, locale);
  if (exact) return exact;
  const needle = compactLearn(text);
  if (!needle || needle.length < 2) return undefined;
  const rows = [...lesson.sentences, ...(lesson.quotes || [])];
  const hit =
    rows.find((item) => compactLearn(item.text) === needle) ||
    rows.find((item) => {
      const compact = compactLearn(item.text);
      return compact.includes(needle) || needle.includes(compact);
    });
  const gloss = hit?.meaning[locale]?.trim();
  if (gloss && gloss !== text.trim()) return gloss;
  return undefined;
}

export function optionGloss(lesson: Lesson, locale: Locale, text: string, guide?: Lesson | null): string | undefined {
  if (!text.trim() || locale === lesson.track) return undefined;
  const vocab = lesson.vocab.find((item) => item.word.trim() === text.trim());
  const fromWord = vocab ? wordGloss(vocab, locale, lesson.track) : undefined;
  if (fromWord) return fromWord;
  const fromLine = sentenceGloss(lesson, locale, text);
  if (fromLine) return fromLine;
  const patternIndex = lesson.theory.patterns.findIndex((item) => item.form === text || item.example === text);
  if (patternIndex >= 0) {
    const guided = guide?.theory.patterns[patternIndex];
    const example = sentenceGloss(lesson, locale, lesson.theory.patterns[patternIndex].example);
    const bits = [guided?.use, guided?.example && guided.example !== text ? guided.example : undefined, example].filter(Boolean);
    if (bits.length) return bits.join(" — ");
  }
  return undefined;
}

export function clozeGloss(lesson: Lesson, locale: Locale, prompt: string, answer?: string): string | undefined {
  if (locale === lesson.track) return undefined;
  const filled = answer ? fillCloze(prompt, answer) : prompt;
  return sentenceGloss(lesson, locale, filled) || sentenceGloss(lesson, locale, prompt);
}

export function wordGloss(
  item: { word: string; meaning: I18nText },
  locale: Locale,
  track: Locale,
) {
  if (locale === track) return undefined;
  const gloss = item.meaning[locale]?.trim();
  if (!gloss || gloss === item.word.trim()) return undefined;
  return gloss;
}
