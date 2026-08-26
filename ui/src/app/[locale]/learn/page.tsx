import { ComingSoonPage } from "@/components/ui/ComingSoon";
import { isLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  return <ComingSoonPage kind="learn" locale={locale} />;
}
