import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const posts = [
  { tag: "post1Tag", title: "post1Title", body: "post1Body", src: photos.notes, shape: "pebble-b" },
  { tag: "post2Tag", title: "post2Title", body: "post2Body", src: photos.cafe, shape: "pebble-a" },
  { tag: "post3Tag", title: "post3Title", body: "post3Body", src: photos.desk, shape: "pebble-d" },
] as const;

export async function Journal() {
  const t = await getTranslations("Journal");

  return (
    <section id="journal" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
            <h2 className="font-display mt-2 text-4xl text-sky-700 sm:text-5xl">{t("title")}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
          </div>
          <Link href="/blogs" className="text-sm font-semibold text-sky-700">
            {t("cta")} →
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.title} delayMs={index * 80}>
              <article
                className={`glass-tile ${post.shape} overflow-hidden p-0 ${
                  index === 1 ? "md:-translate-y-5" : ""
                }`}
              >
                <OrganicImage
                  src={post.src}
                  alt={t(post.title)}
                  frame="plain"
                  className="aspect-[16/10] w-full"
                />
                <div className="p-7">
                  <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
                    {t(post.tag)}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
                    {t(post.title)}
                  </h3>
                  <p className="mt-2 leading-7 text-ink-soft">{t(post.body)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
