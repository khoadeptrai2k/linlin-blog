import { isLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { LearnHub } from "@/components/learn/LearnHub";
import { setRequestLocale } from "next-intl/server";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <LearnHub locale={locale} />;
}
