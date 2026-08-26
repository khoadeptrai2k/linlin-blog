import { ComingSoonPage } from "@/components/ui/ComingSoon";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ComingSoonPage kind="learn" locale={locale} />;
}
