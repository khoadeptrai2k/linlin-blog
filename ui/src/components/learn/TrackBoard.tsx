import { getTranslations } from "next-intl/server";
import { getCatalog, type LearnTrack } from "@/lib/learn/store";
import type { Locale } from "@/i18n/routing";
import { ClassroomDesk } from "@/components/learn/ClassroomDesk";

export async function TrackBoard({ locale, track }: { locale: Locale; track: LearnTrack }) {
  const t = await getTranslations("Learn");
  const catalog = await getCatalog();
  const meta = catalog.tracks.find((item) => item.id === track);
  if (!meta) {
    return (
      <section className="px-4 py-16">
        <p className="text-ink-soft">{t("loadingClass")}</p>
      </section>
    );
  }
  return <ClassroomDesk locale={locale} track={track} meta={meta} />;
}
