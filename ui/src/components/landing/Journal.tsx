"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const posts = [
  { id: "post1", src: photos.notes, shape: "pebble-b" },
  { id: "post2", src: photos.cafe, shape: "pebble-a" },
  { id: "post3", src: photos.desk, shape: "pebble-d" },
] as const;

export function Journal() {
  const t = useTranslations("Journal");
  const common = useTranslations("Common");
  const router = useRouter();
  const [open, setOpen] = useState<(typeof posts)[number]["id"] | null>(null);
  const active = posts.find((post) => post.id === open);

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
            <Reveal key={post.id} delayMs={index * 80}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(post.id)}
                className={`glass-tile ${post.shape} overflow-hidden p-0 ${
                  index === 1 ? "md:-translate-y-5" : ""
                }`}
              >
                <OrganicImage
                  src={post.src}
                  alt={t(`${post.id}Title`)}
                  frame="plain"
                  hud={t(`${post.id}Tag`)}
                  className="aspect-[16/10] w-full"
                />
                <div className="p-7 text-left">
                  <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
                    {t(`${post.id}Tag`)}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
                    {t(`${post.id}Title`)}
                  </h3>
                  <p className="mt-2 leading-7 text-ink-soft">{t(`${post.id}Body`)}</p>
                  <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                    {common("openDetails")}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <CardDrawer
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        eyebrow={active ? t(`${active.id}Tag`) : t("eyebrow")}
        title={active ? t(`${active.id}Title`) : ""}
        body={active ? t(`${active.id}Lead`) : undefined}
        image={active ? { src: active.src, alt: t(`${active.id}Title`) } : undefined}
        tiles={
          active
            ? [{ label: common("keepLabel"), value: t(`${active.id}Keep`), wide: true }]
            : undefined
        }
        ctaLabel={t("readPost")}
        onCta={() => {
          setOpen(null);
          router.push("/blogs");
        }}
      />
    </section>
  );
}
