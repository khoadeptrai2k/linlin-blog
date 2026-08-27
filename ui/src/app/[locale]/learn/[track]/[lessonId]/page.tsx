import { isLocale } from "@/i18n/routing";
import { getLesson, getNextLessonId, isLearnTrack } from "@/lib/learn/store";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; track: string; lessonId: string }>;
}) {
  const { locale, track, lessonId } = await params;
  if (!isLocale(locale) || !isLearnTrack(track)) notFound();
  setRequestLocale(locale);
  const lesson = await getLesson(track, lessonId);
  if (!lesson) notFound();
  const nextId = await getNextLessonId(track, lesson.id);
  const t = await getTranslations("Learn");

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6">
      <div className="learn-blob -left-10 top-6 h-32 w-32 rounded-[58%_42%_50%_50%] bg-sky-200/40" />
      <div className="relative mx-auto mb-8 max-w-6xl">
        <Link href={`/learn/${track}`} className="text-sm font-semibold text-sky-700">
          ← {t("backTrack")}
        </Link>
      </div>
      <LessonPlayer key={lesson.id} lesson={lesson} locale={locale} nextId={nextId} />
    </section>
  );
}
