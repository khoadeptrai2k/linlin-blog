import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { getCurrentUser, getAuthDb, toObjectId } from "@/lib/auth";
import { getCatalog } from "@/lib/learn/store";
import { isLearnTrack, type LearnTrack } from "@/lib/learn/types";
import { PlacementTest } from "@/components/learn/PlacementTest";
import { startUnitForLevel, type PlacementLevel } from "@/lib/learn/placement";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LEVELS = new Set<PlacementLevel>(["new", "a1", "a2", "b1"]);

function accountPath(locale: string) {
  const prefix = locale === "en" || locale === "zh" || locale === "th" ? `/${locale}` : "";
  return `${prefix}/account?next=/learn/placement`;
}

export default async function PlacementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    redirect(accountPath(locale));
  }

  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  const profile = userId && db ? await db.collection("learner_profiles").findOne({ userId }) : null;
  const catalog = await getCatalog();
  const t = await getTranslations("Learn");
  const initialTrack: LearnTrack = isLearnTrack(String(profile?.track)) ? (profile!.track as LearnTrack) : "zh";
  const placedTrack = isLearnTrack(String(profile?.placementTrack || profile?.track))
    ? ((profile?.placementTrack || profile?.track) as LearnTrack)
    : initialTrack;
  const placedLevel = LEVELS.has(profile?.level as PlacementLevel) ? (profile!.level as PlacementLevel) : "new";
  const units = catalog.tracks.find((item) => item.id === placedTrack)?.units || [];
  const startUnitId = startUnitForLevel(units, placedLevel);
  const existing = profile?.placementDone
    ? {
        level: placedLevel,
        score: Number(profile.placementScore) || 0,
        total: Number(profile.placementTotal) || 12,
        track: placedTrack,
        startUnitId,
        startLessonId: units.find((item) => item.id === startUnitId)?.lessonIds[0],
      }
    : null;

  return (
    <section className="duo-shell px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold text-sky-700">{t("tagPlacement")}</p>
        <PlacementTest initialTrack={initialTrack} existing={existing} />
      </div>
    </section>
  );
}
