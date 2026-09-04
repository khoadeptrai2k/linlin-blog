import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Hero() {
  const t = await getTranslations("Hero");
  const home = await getTranslations("Home");
  const classroom = await getTranslations("Classroom");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: home("statPathValue"), label: home("statPathLabel") },
  ];

  const steps = [
    { label: home("stepSound"), state: "is-done" },
    { label: home("stepWord"), state: "is-done" },
    { label: home("stepListen"), state: "is-live" },
    { label: home("stepPractice"), state: "" },
    { label: home("stepPlay"), state: "" },
  ];

  return (
    <section className="home-hero">
      <div className="home-hero-inner">
        <Reveal className="home-hero-copy">
          <p className="home-hero-badge">
            <span />
            {t("badge")}
          </p>
          <h1>{t("title")}</h1>
          <p className="home-hero-lead">{t("subtitle")}</p>
          <div className="home-hero-actions">
            <Link href="/learn" className="home-hero-primary">
              {t("ctaLearn")}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/account" className="home-hero-secondary">
              {home("ctaAccount")}
            </Link>
          </div>
          <dl className="home-hero-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd>{stat.value}</dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delayMs={100} className="home-hero-stage">
          <OrganicImage
            src={photos.morning}
            alt=""
            frame="wide"
            className="home-hero-media"
          />
          <div className="home-hero-journey">
            <div className="home-journey-top">
              <span>{home("todayEyebrow")}</span>
              <b>{classroom("sampleTime")}</b>
            </div>
            <strong>{classroom("sampleTitle")}</strong>
            <div className="home-journey-progress" aria-label={home("todayEyebrow")}>
              {steps.map((step) => (
                <span key={step.label} className={step.state || undefined}>
                  {step.label}
                </span>
              ))}
            </div>
            <small>{home("todayHint")}</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
