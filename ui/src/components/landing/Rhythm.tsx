import { getTranslations } from "next-intl/server";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Rhythm() {
  const t = await getTranslations("Rhythm");
  const sessions = [
    {
      time: t("session1Time"),
      title: t("session1Title"),
      body: t("session1Body"),
      src: photos.morning,
      frame: "pebbleA" as const,
    },
    {
      time: t("session2Time"),
      title: t("session2Title"),
      body: t("session2Body"),
      src: photos.notes,
      frame: "pebbleB" as const,
    },
    {
      time: t("session3Time"),
      title: t("session3Title"),
      body: t("session3Body"),
      src: photos.practice,
      frame: "pebbleC" as const,
    },
    {
      time: t("session4Time"),
      title: t("session4Title"),
      body: t("session4Body"),
      src: photos.listen,
      frame: "pebbleD" as const,
    },
  ];

  return (
    <section id="rhythm" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sessions.map((session, index) => (
            <Reveal key={session.title} delayMs={index * 70}>
              <article
                className={`glass-tile ${session.frame} grid gap-5 p-4 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:p-5 ${
                  index % 2 ? "md:translate-y-6" : ""
                }`}
              >
                <OrganicImage
                  src={session.src}
                  alt={session.title}
                  frame={session.frame}
                  className="aspect-[4/5] w-full sm:aspect-square"
                />
                <div className="px-2 pb-2 sm:px-1 sm:pb-0">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                    {session.time}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{session.title}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{session.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
