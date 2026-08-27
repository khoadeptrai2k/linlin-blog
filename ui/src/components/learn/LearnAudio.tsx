"use client";

export function speakText(text: string, lang: string, slow = false) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = slow ? 0.62 : 0.92;
  window.speechSynthesis.speak(utter);
}

export function SpeakButton({
  text,
  lang,
  slow,
  label,
  onHeard,
}: {
  text: string;
  lang: string;
  slow?: boolean;
  label: string;
  onHeard?: (text: string) => void;
}) {
  return (
    <button
      type="button"
      className="learn-speak"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        speakText(text, lang, slow);
        onHeard?.(text);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    </button>
  );
}

export function Phonetic({
  reading,
  sayVi,
  locale,
  phoneticLabel,
  sayViLabel,
}: {
  reading?: string;
  sayVi?: string;
  locale: string;
  phoneticLabel: string;
  sayViLabel: string;
}) {
  const showReading = Boolean(reading);
  const showSay = Boolean(sayVi) && locale === "vi" && sayVi !== reading;
  if (!showReading && !showSay) return null;
  return (
    <p className="mt-1 text-sm leading-6 text-sky-700">
      {showReading ? (
        <span>
          {phoneticLabel}: {reading}
        </span>
      ) : null}
      {showReading && showSay ? <span className="mx-2 opacity-40">·</span> : null}
      {showSay ? (
        <span>
          {sayViLabel}: {sayVi}
        </span>
      ) : null}
    </p>
  );
}
