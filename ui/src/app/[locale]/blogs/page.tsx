import { ComingSoonPage } from "@/components/ui/ComingSoon";

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ComingSoonPage kind="blogs" locale={locale} />;
}
