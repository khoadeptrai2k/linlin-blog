import { isLocale } from "@/i18n/routing";
import { isLearnTrack } from "@/lib/learn/store";
import { notFound } from "next/navigation";
import { TrackBoard } from "@/components/learn/TrackBoard";
import { setRequestLocale } from "next-intl/server";

export default async function LearnTrackPage({
  params,
}: {
  params: Promise<{ locale: string; track: string }>;
}) {
  const { locale, track } = await params;
  if (!isLocale(locale) || !isLearnTrack(track)) notFound();
  setRequestLocale(locale);
  return <TrackBoard locale={locale} track={track} />;
}
