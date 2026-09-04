"use client";

import { useId, useSyncExternalStore } from "react";
import { resolveSpeechLang } from "@/lib/learn/language";

export type SpeakChunk = string | { text: string; lang?: string };

let playToken = 0;
let watchdog: number | undefined;
let audioEl: HTMLAudioElement | undefined;
let activeKey = "";
const liveSubs = new Set<() => void>();

function emit() {
  liveSubs.forEach((fn) => fn());
}

function setActive(key: string) {
  if (activeKey === key) return;
  activeKey = key;
  emit();
}

function subscribeLive(fn: () => void) {
  liveSubs.add(fn);
  return () => liveSubs.delete(fn);
}

function engine() {
  if (typeof window === "undefined") return undefined;
  return window.speechSynthesis;
}

function stopAudio() {
  if (!audioEl) return;
  audioEl.onended = null;
  audioEl.onerror = null;
  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl = undefined;
}

function stopWatchdog() {
  if (watchdog) window.clearInterval(watchdog);
  watchdog = undefined;
}

function startWatchdog() {
  const synth = engine();
  if (!synth) return;
  stopWatchdog();
  watchdog = window.setInterval(() => {
    if (synth.paused) synth.resume();
  }, 160);
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => window.speechSynthesis.getVoices());
}

function nativeSpeak(text: string, lang: string, slow: boolean, token: number, onDone: () => void) {
  const synth = engine();
  if (!synth) {
    onDone();
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = resolveSpeechLang(lang);
  utter.rate = slow ? 0.85 : 1;
  utter.volume = 1;
  (globalThis as unknown as { __linlinUtter?: SpeechSynthesisUtterance }).__linlinUtter = utter;
  let settled = false;
  const finish = () => {
    if (settled || token !== playToken) return;
    settled = true;
    onDone();
  };
  utter.onend = finish;
  utter.onerror = finish;
  synth.speak(utter);
  if (synth.paused) synth.resume();
}

function speakOne(text: string, lang: string, slow: boolean, token: number, onDone: () => void) {
  const code = resolveSpeechLang(lang);
  if (token !== playToken) {
    onDone();
    return;
  }

  stopAudio();
  const el = new Audio(`/api/tts?${new URLSearchParams({ q: text.slice(0, 180), lang: code })}`);
  audioEl = el;
  let settled = false;
  const finish = () => {
    if (settled || token !== playToken) return;
    settled = true;
    window.clearTimeout(timer);
    if (audioEl === el) audioEl = undefined;
    onDone();
  };
  const timer = window.setTimeout(finish, 8000);
  el.onended = finish;
  el.onerror = () => {
    if (settled) return;
    nativeSpeak(text, code, slow, token, finish);
  };
  void el.play().catch(() => {
    if (settled) return;
    nativeSpeak(text, code, slow, token, finish);
  });
}

export function speakText(text: string, lang: string, slow = false, sourceKey = "") {
  const clean = text.replace(/。{2,}/g, "。").trim();
  if (!clean) return;
  playToken += 1;
  const token = playToken;
  setActive(sourceKey);
  startWatchdog();
  speakOne(clean, lang, slow, token, () => {
    if (token !== playToken) return;
    stopWatchdog();
    setActive("");
  });
}

export function speakQueue(
  chunks: SpeakChunk[],
  lang: string,
  slow = false,
  onIndex?: (index: number) => void,
  sourceKey = "",
): () => void {
  const parts = chunks
    .map((item) => (typeof item === "string" ? { text: item, lang } : { text: item.text, lang: item.lang || lang }))
    .map((item) => ({ ...item, text: item.text.replace(/。{2,}/g, "。").trim() }))
    .filter((item) => item.text);

  playToken += 1;
  const token = playToken;
  setActive(sourceKey);
  startWatchdog();

  if (!parts.length) {
    setActive("");
    onIndex?.(-1);
    return () => undefined;
  }

  let cancelled = false;
  let index = 0;

  const play = () => {
    if (cancelled || token !== playToken) return;
    if (index >= parts.length) {
      stopWatchdog();
      setActive("");
      onIndex?.(-1);
      return;
    }
    onIndex?.(index);
    const part = parts[index];
    speakOne(part.text, part.lang, slow, token, () => {
      if (cancelled || token !== playToken) return;
      index += 1;
      window.setTimeout(play, 80);
    });
  };

  play();

  return () => {
    cancelled = true;
    if (token !== playToken) return;
    playToken += 1;
    stopWatchdog();
    stopAudio();
    engine()?.cancel();
    setActive("");
  };
}

export function speakPair(
  target: string,
  targetLang: string,
  meaning?: string,
  meaningLang?: string,
  slow = false,
  sourceKey = "",
) {
  const line = target.replace(/。{2,}/g, "。").trim();
  const gloss = meaning?.replace(/。{2,}/g, "。").trim();
  if (gloss && meaningLang && gloss !== line) {
    speakQueue(
      [
        { text: line, lang: targetLang },
        { text: gloss, lang: meaningLang },
      ],
      targetLang,
      slow,
      undefined,
      sourceKey,
    );
    return;
  }
  speakText(line, targetLang, slow, sourceKey);
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
  const id = useId();
  const on = useSyncExternalStore(subscribeLive, () => activeKey === id, () => false);
  return (
    <button
      type="button"
      className={on ? "learn-speak is-on" : "learn-speak"}
      aria-label={label}
      aria-pressed={on}
      data-ask-skip
      onClick={(event) => {
        event.stopPropagation();
        speakPair(text, lang, explain, uiLang, slow, id);
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
