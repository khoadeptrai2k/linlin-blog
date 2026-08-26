import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function ComingSoonPage({
  kind,
  locale,
}: {
  kind: "blogs" | "learn";
  locale: Locale;
}) {
  setRequestLocale(locale);
  const t = await getTranslations("ComingSoon");

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="glass-tile pebble-a px-8 py-12">
        <p className="text-sm font-medium text-sky-700">Linlin</p>
        <h1 className="font-display mt-3 text-4xl text-sky-700">
          {kind === "blogs" ? t("blogsTitle") : t("learnTitle")}
        </h1>
        <p className="mt-4 leading-7 text-ink-soft">
          {kind === "blogs" ? t("blogsBody") : t("learnBody")}
        </p>
        <Link href="/" className="btn-primary mt-8">
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
