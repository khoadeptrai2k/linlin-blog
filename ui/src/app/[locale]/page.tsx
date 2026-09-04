import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { HomeExperience } from "@/components/landing/HomeExperience";
import { isLocale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <div className="study-home">
      <Hero />
      <HomeExperience />
    </div>
  );
}
