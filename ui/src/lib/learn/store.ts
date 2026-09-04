import catalogJson from "@/content/learn/catalog.json";
import { getMongo, isMongoEnabled } from "@/lib/mongo";
import type { Locale } from "@/i18n/routing";
import { UI_SPEECH } from "@/lib/learn/language";
import type { Catalog, LearnTrack, Lesson } from "@/lib/learn/types";

export type { Catalog, CatalogTrack, Exercise, I18nText, LearnTrack, Lesson, SentenceItem, VocabItem } from "@/lib/learn/types";
export { isLearnTrack } from "@/lib/learn/types";

export type LessonCard = Pick<Lesson, "id" | "title" | "goal" | "minutes" | "order" | "kind">;

const localCache: Partial<Record<LearnTrack, Lesson[]>> = {};

function withSpeechLang(lesson: Lesson): Lesson {
  if (lesson.speechLang?.trim()) return lesson;
  return { ...lesson, speechLang: UI_SPEECH[lesson.track] || "en-US" };
}

async function loadLocalLessons(track: LearnTrack): Promise<Lesson[]> {
  if (localCache[track]) return localCache[track]!;
  const loaders = {
    vi: () => import("@/content/learn/vi.json"),
    en: () => import("@/content/learn/en.json"),
    zh: () => import("@/content/learn/zh.json"),
    th: () => import("@/content/learn/th.json"),
  };
  const mod = await loaders[track]();
  const rows = (mod.default as Lesson[]).map(withSpeechLang);
  localCache[track] = rows;
  return rows;
}

export async function getCatalog(): Promise<Catalog> {
  if (isMongoEnabled()) {
    const db = await getMongo();
    const mainDoc = await db?.collection("learn_catalog").findOne({ id: "main" });
    const doc = mainDoc ?? (await db?.collection("learn_catalog").findOne({}));
    if (doc) {
      const { _id: _unused, ...rest } = doc;
      void _unused;
      return rest as Catalog;
    }
  }
  return catalogJson as Catalog;
}

export async function getLessonCards(track: LearnTrack): Promise<LessonCard[]> {
  if (isMongoEnabled()) {
    const db = await getMongo();
    const rows = await db
      ?.collection("learn_lessons")
      .find({ track })
      .project({ id: 1, title: 1, goal: 1, minutes: 1, order: 1, kind: 1, _id: 0 })
      .sort({ order: 1 })
      .toArray();
    if (rows?.length) return rows as LessonCard[];
  }
  return (await loadLocalLessons(track)).map(({ id, title, goal, minutes, order, kind }) => ({
    id,
    title,
    goal,
    minutes,
    order,
    kind,
  }));
}

export async function getLesson(track: LearnTrack, id: string): Promise<Lesson | null> {
  if (isMongoEnabled()) {
    const db = await getMongo();
    const row = await db?.collection("learn_lessons").findOne({ track, id });
    if (row) {
      const { _id: _unused, ...lesson } = row;
      void _unused;
      return withSpeechLang(lesson as Lesson);
    }
  }
  return (await loadLocalLessons(track)).find((lesson) => lesson.id === id) ?? null;
}

export async function getGuideLesson(locale: Locale, lesson: Lesson): Promise<Lesson | null> {
  if (locale === lesson.track) return null;
  if (isMongoEnabled()) {
    const db = await getMongo();
    const row = await db?.collection("learn_lessons").findOne({
      track: locale,
      unitId: lesson.unitId,
      kind: lesson.kind,
    });
    if (row) {
      const { _id: _unused, ...guide } = row;
      void _unused;
      return withSpeechLang(guide as Lesson);
    }
  }
  const rows = await loadLocalLessons(locale);
  return rows.find((item) => item.unitId === lesson.unitId && item.kind === lesson.kind) ?? null;
}

export async function getNextLessonId(track: LearnTrack, id: string): Promise<string | undefined> {
  const catalog = await getCatalog();
  const ids = catalog.tracks.find((item) => item.id === track)?.units.flatMap((unit) => unit.lessonIds) ?? [];
  const index = ids.indexOf(id);
  return index >= 0 ? ids[index + 1] : undefined;
}
