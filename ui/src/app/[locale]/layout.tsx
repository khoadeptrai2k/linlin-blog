import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Fraunces,
  Noto_Serif_SC,
  Noto_Serif_Thai,
} from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { routing } from "@/i18n/routing";
import "../globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-fraunces",
});

const notoSc = Noto_Serif_SC({
  weight: ["400", "600", "700"],
  variable: "--font-noto-sc",
  preload: false,
});

const notoThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-thai",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: {
      default: t("title"),
      template: `%s · ${t("title")}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${beVietnam.variable} ${fraunces.variable} ${notoSc.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="flex-1 overflow-x-hidden pt-20">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
