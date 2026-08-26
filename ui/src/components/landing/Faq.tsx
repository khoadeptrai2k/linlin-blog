import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";

export async function Faq() {
  const t = await getTranslations("Faq");
  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];
  const shapes = ["pebble-a", "pebble-b", "pebble-c", "pebble-d"];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 text-4xl text-sky-700 sm:text-5xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4">
          {items.map((item, index) => (
            <Reveal key={item.q} delayMs={index * 50}>
              <details className={`glass-tile ${shapes[index % shapes.length]} group p-5 sm:p-6`}>
                <summary className="cursor-pointer text-lg font-semibold text-ink">
                  {item.q}
                </summary>
                <div className="faq-body">
                  <div>
                    <p className="pt-3 leading-7 text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
