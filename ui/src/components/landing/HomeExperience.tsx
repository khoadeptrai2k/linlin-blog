"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeMeta, routing, type Locale } from "@/i18n/routing";
import { photos } from "@/lib/photos";
import { Reveal } from "@/components/ui/Reveal";

const scenes = [
  { id: "scene1", src: photos.cafe, className: "is-wide" },
  { id: "scene2", src: photos.market, className: "is-tall" },
  { id: "scene3", src: photos.trip, className: "" },
  { id: "scene4", src: photos.chat, className: "" },
] as const;

const trackKeys = {
  vi: { title: "viTitle", body: "viBody", status: "viStatus", sample: "viSample" },
  en: { title: "enTitle", body: "enBody", status: "enStatus", sample: "enSample" },
  zh: { title: "zhTitle", body: "zhBody", status: "zhStatus", sample: "zhSample" },
  th: { title: "thTitle", body: "thBody", status: "thStatus", sample: "thSample" },
} as const;

const skillKeys = ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7"] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 10v4h3l4 3V7L8 10H5Z" />
      <path d="M15 9c1.6 1.7 1.6 4.3 0 6M18 6.5c3.2 3 3.2 8 0 11" />
    </svg>
  );
}

export function HomeExperience() {
  const classroom = useTranslations("Classroom");
  const method = useTranslations("Method");
  const sceneText = useTranslations("Scenes");
  const tracks = useTranslations("Tracks");
  const faq = useTranslations("Faq");
  const invite = useTranslations("Invite");
  const hero = useTranslations("Hero");
  const home = useTranslations("Home");
  const [activeTrack, setActiveTrack] = useState<Locale>("zh");

  const steps = [
    { title: classroom("item1Title"), body: classroom("item1Body"), label: home("labelWord") },
    { title: classroom("item2Title"), body: classroom("item2Body"), label: home("labelSentence") },
    { title: classroom("item3Title"), body: classroom("item3Body"), label: home("labelListen") },
    { title: home("playTitle"), body: home("playBody"), label: home("labelPlay") },
  ];

  const methodSteps = [
    { title: method("step1Title"), body: method("step1Body"), src: photos.notes },
    { title: method("step2Title"), body: method("step2Body"), src: photos.cafe },
    { title: method("step3Title"), body: method("step3Body"), src: photos.practice },
  ];

  const faqItems = [
    [faq("q1"), faq("a1")],
    [faq("q2"), faq("a2")],
    [faq("q3"), faq("a3")],
    [faq("q6"), faq("a6")],
  ];

  const active = trackKeys[activeTrack];

  return (
    <>
      <section id="classroom" className="home-modern-section home-lesson-section">
        <div className="home-modern-inner">
          <Reveal className="home-modern-heading">
            <p>{classroom("eyebrow")}</p>
            <h2>{classroom("title")}</h2>
            <span>{classroom("subtitle")}</span>
          </Reveal>

          <Reveal delayMs={90} className="home-lesson-lab">
            <figure className="home-lesson-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos.practice} alt={classroom("sampleTitle")} />
              <figcaption>
                <span>{classroom("sampleEyebrow")}</span>
                <strong>{classroom("sampleTitle")}</strong>
              </figcaption>
              <button type="button" className="home-sound-button" aria-label={home("listenSample")}>
                <SoundIcon />
              </button>
            </figure>

            <div className="home-lesson-console">
              <div className="home-console-top">
                <span>{home("lessonMeta")}</span>
                <b>{classroom("sampleTime")}</b>
              </div>
              <h3>{home("consoleTitle")}</h3>
              <div className="home-console-progress"><span /></div>
              <ol className="home-console-steps">
                {steps.map((step, index) => (
                  <li key={step.title} className={index < 2 ? "is-complete" : index === 2 ? "is-current" : ""}>
                    <i>{index < 2 ? "✓" : index + 1}</i>
                    <div>
                      <small>{step.label}</small>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/learn" className="home-modern-cta">
                {hero("ctaLearn")} <ArrowIcon />
              </Link>
            </div>
          </Reveal>

          <ul className="home-skill-row" aria-label={home("skillsLabel")}>
            {skillKeys.map((key) => (
              <li key={key}>{home(key)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="method" className="home-modern-section home-method-section">
        <div className="home-modern-inner home-method-layout">
          <Reveal className="home-method-intro">
            <p>{method("eyebrow")}</p>
            <h2>{method("title")}</h2>
            <span>{method("subtitle")}</span>
            <Link href="/learn" className="home-text-link">
              {home("methodCta")} <ArrowIcon />
            </Link>
          </Reveal>

          <ol className="home-method-list">
            {methodSteps.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 80}>
                <li>
                  <span className="home-method-number">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.src} alt="" />
                  </figure>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="scenes" className="home-modern-section home-scenes-section">
        <div className="home-modern-inner">
          <Reveal className="home-modern-heading is-split">
            <div>
              <p>{sceneText("eyebrow")}</p>
              <h2>{sceneText("title")}</h2>
            </div>
            <span>{sceneText("subtitle")}</span>
          </Reveal>

          <div className="home-scenes-bento">
            {scenes.map((scene, index) => (
              <Reveal key={scene.id} delayMs={index * 70} className={scene.className}>
                <Link href="/learn" className="home-scene-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={scene.src} alt={sceneText(`${scene.id}Title`)} />
                  <span className="home-scene-shade" />
                  <div>
                    <small>{sceneText(`${scene.id}Hint`)}</small>
                    <h3>{sceneText(`${scene.id}Title`)}</h3>
                    <p>{sceneText(`${scene.id}Body`)}</p>
                    <b aria-hidden="true"><ArrowIcon /></b>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="tracks" className="home-modern-section home-tracks-section">
        <div className="home-modern-inner">
          <Reveal className="home-modern-heading is-centered">
            <p>{tracks("eyebrow")}</p>
            <h2>{tracks("title")}</h2>
            <span>{tracks("subtitle")}</span>
          </Reveal>

          <Reveal delayMs={80} className="home-track-explorer">
            <nav aria-label={home("tracksNav")}>
              {routing.locales.map((track, index) => (
                <button
                  key={track}
                  type="button"
                  className={activeTrack === track ? "is-active" : ""}
                  onClick={() => setActiveTrack(track)}
                >
                  <span>0{index + 1}</span>
                  <strong>{tracks(trackKeys[track].title)}</strong>
                  <small>{localeMeta[track].label}</small>
                </button>
              ))}
            </nav>

            <div className="home-track-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos.desk} alt="" />
              <span className="home-track-shade" />
              <div className="home-track-copy">
                <small>{tracks(active.status)}</small>
                <strong className="home-track-native">{localeMeta[activeTrack].native}</strong>
                <h3>{tracks(active.title)}</h3>
                <p>{tracks(active.body)}</p>
                <blockquote>{tracks(active.sample)}</blockquote>
                <Link href="/learn" locale={activeTrack} className="home-modern-cta">
                  {tracks("openPath")} <ArrowIcon />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-modern-section home-close-section">
        <div className="home-modern-inner home-close-layout">
          <div className="home-faq">
            <Reveal className="home-modern-heading">
              <p>{faq("eyebrow")}</p>
              <h2>{faq("title")}</h2>
            </Reveal>
            <div className="home-faq-list">
              {faqItems.map(([question, answer], index) => (
                <Reveal key={question} delayMs={index * 45}>
                  <details>
                    <summary><span>0{index + 1}</span>{question}<i>+</i></summary>
                    <div><p>{answer}</p></div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delayMs={100} className="home-invite">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos.trip} alt="" />
            </figure>
            <div>
              <small>{home("inviteEyebrow")}</small>
              <h2>{invite("title")}</h2>
              <p>{invite("subtitle")}</p>
              <div>
                <Link href="/learn" className="home-modern-cta">
                  {invite("cta")} <ArrowIcon />
                </Link>
                <Link href="/account" className="home-invite-account">{home("inviteAccount")}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
