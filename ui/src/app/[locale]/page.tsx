import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { About } from "@/components/landing/About";
import { Classroom } from "@/components/landing/Classroom";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { Invite } from "@/components/landing/Invite";
import { Journal } from "@/components/landing/Journal";
import { Method } from "@/components/landing/Method";
import { Rhythm } from "@/components/landing/Rhythm";
import { Scenes } from "@/components/landing/Scenes";
import { Studio } from "@/components/landing/Studio";
import { Tracks } from "@/components/landing/Tracks";
import { Wave } from "@/components/ui/Wave";
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
    <>
      <Hero />
      <Wave from="#f4eee3" to="#eef6fb" />
      <div className="bg-[#eef6fb]">
        <About />
      </div>
      <Wave from="#eef6fb" to="#f4eee3" />
      <Method />
      <Wave from="#f4eee3" to="#e8f2f8" />
      <div className="bg-[#e8f2f8]">
        <Rhythm />
      </div>
      <Wave from="#e8f2f8" to="#f4eee3" />
      <Studio />
      <Wave from="#f4eee3" to="#eef6fb" />
      <div className="bg-[#eef6fb]">
        <Scenes />
      </div>
      <Wave from="#eef6fb" to="#f4eee3" />
      <Tracks />
      <Wave from="#f4eee3" to="#e8f2f8" />
      <div className="bg-[#e8f2f8]">
        <Classroom />
      </div>
      <Wave from="#e8f2f8" to="#f4eee3" />
      <Journal />
      <Wave from="#f4eee3" to="#eef6fb" />
      <div className="bg-[#eef6fb]">
        <Faq />
      </div>
      <Wave from="#eef6fb" to="#f4eee3" />
      <Invite />
    </>
  );
}
