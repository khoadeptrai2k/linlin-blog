import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { getCatalog } from "@/lib/learn/store";

export async function LearnHub({ locale: _locale }: { locale: Locale }) {
  const t = await getTranslations("Learn");
  const tracksT = await getTranslations("Tracks");
  const catalog = await getCatalog();
  const bodies = {
    vi: tracksT("viBody"),
    en: tracksT("enBody"),
    zh: tracksT("zhBody"),
    th: tracksT("thBody"),
  };

  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.08] text-sky-700">{t("title")}</h1>
        <p className="mt-4 leading-7 text-ink-soft">{t("subtitle")}</p>
        <p className="mt-3 text-sm font-medium text-sky-700">{t("splitNote")}</p>
        <ol className="mt-8 grid gap-3">
          {catalog.tracks.map((track) => (
            <li key={track.id}>
              <Link href={`/learn/${track.id}`} className="glass-tile flex items-center gap-4 p-5">
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
                    {localeMeta[track.id].native}
                  </span>
                  <span className="font-display mt-1 block text-xl text-sky-700">{localeMeta[track.id].label}</span>
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">{bodies[track.id]}</span>
                </span>
                <span className="btn-primary shrink-0 py-2">{t("enterClass")}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
