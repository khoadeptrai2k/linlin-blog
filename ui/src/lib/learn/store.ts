import catalogJson from "@/content/learn/catalog.json";
import viLessons from "@/content/learn/vi.json";
import enLessons from "@/content/learn/en.json";
import zhLessons from "@/content/learn/zh.json";
import thLessons from "@/content/learn/th.json";
import { getMongo, isMongoEnabled } from "@/lib/mongo";
import type { Catalog, LearnTrack, Lesson } from "@/lib/learn/types";

export type { Catalog, CatalogTrack, Exercise, I18nText, LearnTrack, Lesson, SentenceItem, VocabItem } from "@/lib/learn/types";
export { isLearnTrack } from "@/lib/learn/types";

export type LessonCard = Pick<Lesson, "id" | "title" | "goal" | "minutes" | "order">;

const localLessons: Record<LearnTrack, Lesson[]> = {
  vi: viLessons as Lesson[],
  en: enLessons as Lesson[],
  zh: zhLessons as Lesson[],
  th: thLessons as Lesson[],
};

export async function getCatalog(): Promise<Catalog> {
  if (isMongoEnabled()) {
    const db = await getMongo();
    const doc = await db?.collection("learn_catalog").findOne({});
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
      .project({ id: 1, title: 1, goal: 1, minutes: 1, order: 1, _id: 0 })
      .sort({ order: 1 })
      .toArray();
    if (rows?.length) return rows as LessonCard[];
  }
  return (localLessons[track] ?? []).map(({ id, title, goal, minutes, order }) => ({
    id,
    title,
    goal,
    minutes,
    order,
  }));
}

export async function getLesson(track: LearnTrack, id: string): Promise<Lesson | null> {
  if (isMongoEnabled()) {
    const db = await getMongo();
    const row = await db?.collection("learn_lessons").findOne({ track, id });
    if (row) {
      const { _id: _unused, ...lesson } = row;
      void _unused;
      return lesson as Lesson;
    }
  }
  return localLessons[track]?.find((lesson) => lesson.id === id) ?? null;
}

export async function getNextLessonId(track: LearnTrack, id: string): Promise<string | undefined> {
  const catalog = await getCatalog();
  const ids = catalog.tracks.find((item) => item.id === track)?.units.flatMap((unit) => unit.lessonIds) ?? [];
  const index = ids.indexOf(id);
  return index >= 0 ? ids[index + 1] : undefined;
}
