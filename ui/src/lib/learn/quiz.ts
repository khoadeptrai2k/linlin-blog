import type { Locale } from "@/i18n/routing";
import { clozeGloss, optionGloss, sentenceGloss } from "@/lib/learn/language";
import { teacherTheory } from "@/lib/learn/guide";
import type { Exercise, I18nText, Lesson } from "@/lib/learn/types";
import type { useTranslations } from "next-intl";

function isI18nText(value: I18nText | string): value is I18nText {
  return typeof value === "object" && value !== null && "vi" in value;
}

export type GlossWhen = "always" | "checked" | "never";

export type DrillHelp = {
  title: string;
  blurb?: string;
  target?: string;
  answerGloss?: string;
  glossWhen: GlossWhen;
};

type LearnT = ReturnType<typeof useTranslations<"Learn">>;

export function optionGlossWhen(exercise: Exercise, lesson: Lesson, locale: Locale): GlossWhen {
  if (locale === lesson.track || exercise.type !== "mcq") return "never";
  if (exercise.promptKey === "whichSentence") return "checked";
  if (exercise.promptKey === "whichFits" || exercise.promptKey === "whichPattern" || exercise.promptKey === "whichLine") {
    return "always";
  }
  const options = exercise.options;
  const asMeanings = options.every((item) => lesson.vocab.some((row) => row.meaning[locale] === item));
  if (asMeanings) return "never";
  const asWords = options.every((item) => lesson.vocab.some((row) => row.word === item));
  if (asWords) return "checked";
  return "always";
}

export function drillHelp(
  exercise: Exercise,
  lesson: Lesson,
  locale: Locale,
  guide: Lesson | null | undefined,
  t: LearnT,
): DrillHelp {
  const glossWhen = optionGlossWhen(exercise, lesson, locale);
  const answerText = Array.isArray(exercise.answer) ? exercise.answer.join(" ") : exercise.answer;
  const answerGloss =
    optionGloss(lesson, locale, answerText, guide) ||
    sentenceGloss(lesson, locale, answerText) ||
    (typeof exercise.prompt === "string" ? clozeGloss(lesson, locale, exercise.prompt, answerText) : undefined);
  const teacher = teacherTheory(lesson, guide);

  if (exercise.type === "mcq" && exercise.promptKey === "whichPattern") {
    const use = teacher.patterns[0]?.use;
    return { title: t("whichPattern"), blurb: use, answerGloss, glossWhen };
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichLine") {
    return {
      title: t("whichLine"),
      blurb: t("chooseGloss"),
      answerGloss,
      glossWhen,
    };
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichSentence") {
    const meaning = exercise.promptI18n?.[locale] || exercise.promptI18n?.[lesson.track];
    return { title: t("whichSentence"), blurb: meaning, answerGloss, glossWhen };
  }
  if (exercise.type === "mcq" && exercise.promptKey === "whichFits") {
    const meaning = clozeGloss(lesson, locale, exercise.prompt, answerText);
    return {
      title: t("whichFits"),
      blurb: meaning ? t("clozeMeans", { text: meaning }) : t("chooseGloss"),
      target: exercise.prompt,
      answerGloss,
      glossWhen,
    };
  }
  if (exercise.type === "gap") {
    const meaning = clozeGloss(lesson, locale, exercise.prompt, answerText);
    return {
      title: t("fillThis"),
      blurb: meaning ? t("clozeMeans", { text: meaning }) : t("chooseGloss"),
      target: exercise.prompt,
      answerGloss,
      glossWhen: "never",
    };
  }
  if (exercise.type === "order") {
    const meaning = isI18nText(exercise.prompt) ? exercise.prompt[locale] || exercise.prompt[lesson.track] : undefined;
    return { title: t("arrange"), blurb: meaning, answerGloss: meaning, glossWhen: "never" };
  }

  if (typeof exercise.prompt === "string" && /_{2,}|____/.test(exercise.prompt)) {
    const meaning = clozeGloss(lesson, locale, exercise.prompt, answerText);
    return {
      title: t("whichFits"),
      blurb: meaning ? t("clozeMeans", { text: meaning }) : exercise.prompt,
      target: exercise.prompt,
      answerGloss,
      glossWhen,
    };
  }

  const prompt = isI18nText(exercise.prompt) ? exercise.prompt[locale] || exercise.prompt[lesson.track] : exercise.prompt;
  return {
    title: prompt,
    blurb: answerGloss && glossWhen === "always" ? t("clozeMeans", { text: answerGloss }) : undefined,
    answerGloss,
    glossWhen,
  };
}
