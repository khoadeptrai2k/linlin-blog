import { ComingSoonPage } from "@/components/ui/ComingSoon";
import { isLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  return <ComingSoonPage kind="blogs" locale={locale} />;
}
