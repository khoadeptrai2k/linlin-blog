import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 sm:px-6">
      <div className="site-footer-card glass-tile pebble-d mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-ink-soft">{t("tagline")}</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-ink-soft">
            <Link href="/#classroom" className="hover:text-sky-700">
              {nav("classroom")}
            </Link>
            <Link href="/#method" className="hover:text-sky-700">
              {nav("method")}
            </Link>
            <Link href="/#scenes" className="hover:text-sky-700">
              {nav("scenes")}
            </Link>
            <Link href="/blogs" className="hover:text-sky-700">
              {nav("blogs")}
            </Link>
            <Link href="/learn" className="hover:text-sky-700">
              {nav("learn")}
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-ink-soft">
          © {year} · {t("rights")}
        </p>
      </div>
    </footer>
  );
}
