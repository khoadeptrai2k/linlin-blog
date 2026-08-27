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
    <section className="px-4 pb-16 pt-6 sm:px-6">
      <div className="mx-auto mb-5 max-w-xl">
        <Link href={`/learn/${track}`} className="text-sm font-semibold text-sky-700">
          ← {t("backTrack")}
        </Link>
      </div>
      <LessonPlayer key={lesson.id} lesson={lesson} locale={locale} nextId={nextId} />
    </section>
  );
}
