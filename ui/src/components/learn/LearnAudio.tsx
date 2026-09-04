"use client";

export type SpeakChunk = string | { text: string; lang?: string };

let playToken = 0;
let watchdog: number | undefined;

function synth() {
  if (typeof window === "undefined") return undefined;
  return window.speechSynthesis;
}

function loadVoices(): SpeechSynthesisVoice[] {
  return synth()?.getVoices() ?? [];
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = loadVoices();
  const want = lang.replace("_", "-").toLowerCase();
  const prefix = want.slice(0, 2);
  return (
    voices.find((voice) => voice.lang.replace("_", "-").toLowerCase() === want) ||
    voices.find((voice) => voice.lang.replace("_", "-").toLowerCase().startsWith(`${prefix}-`)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix))
  );
}

function startWatchdog() {
  const engine = synth();
  if (!engine || watchdog) return;
  watchdog = window.setInterval(() => {
    if (engine.speaking) engine.resume();
  }, 4000);
}

function stopWatchdog() {
  if (watchdog) window.clearInterval(watchdog);
  watchdog = undefined;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => window.speechSynthesis.getVoices());
}

function speakUtterance(text: string, lang: string, slow: boolean, token: number, onDone: () => void) {
  const engine = synth();
  if (!engine || token !== playToken) {
    onDone();
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = slow ? 0.62 : 0.92;
  const voice = pickVoice(lang);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }

  let settled = false;
  const finish = () => {
    if (settled || token !== playToken) return;
    settled = true;
    onDone();
  };
  utter.onend = finish;
  utter.onerror = finish;

  const kick = () => {
    if (token !== playToken) return;
    engine.speak(utter);
    if (engine.paused) engine.resume();
  };

  if (engine.speaking || engine.pending) {
    window.setTimeout(kick, 50);
    return;
  }
  kick();
}

export function speakText(text: string, lang: string, slow = false) {
  const engine = synth();
  const clean = text.replace(/。{2,}/g, "。").trim();
  if (!engine || !clean) return;
  playToken += 1;
  const token = playToken;
  engine.cancel();
  startWatchdog();
  speakUtterance(clean, lang, slow, token, () => {
    if (token === playToken) stopWatchdog();
  });
}

export function speakQueue(
  chunks: SpeakChunk[],
  lang: string,
  slow = false,
  onIndex?: (index: number) => void,
): () => void {
  const engine = synth();
  const parts = chunks
    .map((item) => (typeof item === "string" ? { text: item, lang } : { text: item.text, lang: item.lang || lang }))
    .map((item) => ({ ...item, text: item.text.replace(/。{2,}/g, "。").trim() }))
    .filter((item) => item.text);

  playToken += 1;
  const token = playToken;
  engine?.cancel();

  if (!engine || !parts.length) {
    onIndex?.(-1);
    return () => undefined;
  }

  let cancelled = false;
  let index = 0;
  startWatchdog();

  const play = () => {
    if (cancelled || token !== playToken) return;
    if (index >= parts.length) {
      stopWatchdog();
      onIndex?.(-1);
      return;
    }
    onIndex?.(index);
    const part = parts[index];
    speakUtterance(part.text, part.lang, slow, token, () => {
      if (cancelled || token !== playToken) return;
      index += 1;
      window.setTimeout(play, 160);
    });
  };

  play();
  return () => {
    cancelled = true;
    if (token === playToken) {
      playToken += 1;
      stopWatchdog();
      engine.cancel();
    }
  };
}

export function SpeakButton({
  text,
  lang,
  slow,
  label,
  onHeard,
  explain,
  uiLang,
}: {
  text: string;
  lang: string;
  slow?: boolean;
  label: string;
  onHeard?: (text: string) => void;
  explain?: string;
  uiLang?: string;
}) {
  return (
    <button
      type="button"
      className="learn-speak"
      aria-label={label}
      data-ask-skip
      onClick={(event) => {
        event.stopPropagation();
        const meaning = explain?.trim();
        if (meaning && uiLang && meaning !== text.trim()) {
          speakQueue([{ text: meaning, lang: uiLang }, { text, lang }], lang, slow);
        } else {
          speakText(text, lang, slow);
        }
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
