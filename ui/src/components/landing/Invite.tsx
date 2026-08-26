import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SpeakerFrame } from "@/components/brand/SpeakerFrame";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Invite() {
  const t = await getTranslations("Invite");
  const profile = await getTranslations("Profile");

  return (
    <section className="px-4 py-10 pb-20 sm:px-6">
      <Reveal>
        <div className="island-banner relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden px-6 py-16 text-center pebble-a sm:px-24 sm:py-20">
          <SpeakerFrame
            src={photos.trip}
            alt={profile("name")}
            frame="peek"
            className="absolute -left-8 -top-10 hidden h-40 w-40 md:block"
          />
          <SpeakerFrame
            src={photos.portrait}
            alt={profile("name")}
            frame="peek"
            className="absolute -bottom-12 -right-6 hidden h-36 w-36 md:block"
          />
          <h2 className="font-display relative text-4xl text-[var(--deep)] sm:text-5xl">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl leading-7 text-[var(--ocean)]">
            {t("subtitle")}
          </p>
          <Link href="/learn" className="btn-primary relative mt-8">
            {t("cta")}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
