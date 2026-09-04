"use client";

import { useEffect, useMemo, useState } from "react";
import { Phonetic, SpeakButton } from "@/components/learn/LearnAudio";
import { WordPicture } from "@/components/learn/LessonArt";
import { pictureFor, pictureForVocab } from "@/lib/learn/picture";
import type { QuoteItem, VocabItem } from "@/lib/learn/types";
import type { Locale } from "@/i18n/routing";

type Card = { id: string; pair: string; face: string };

function shuffle<T>(items: T[], seed: string) {
  const copy = [...items];
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let s = h >>> 0;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuoteBoard({
  quotes,
  lang,
  locale,
  slow,
  hearLabel,
  phoneticLabel,
  sayViLabel,
}: {
  quotes: QuoteItem[];
  lang: string;
  locale: Locale;
  slow: boolean;
  hearLabel: string;
  phoneticLabel: string;
  sayViLabel: string;
}) {
  return (
    <ul className="learn-stack grid gap-3">
      {quotes.map((item) => (
        <li key={item.text} className="control-tile pebble-b min-h-0">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-lg leading-7 text-sky-700">{item.text}</p>
            <SpeakButton text={item.text} lang={lang} slow={slow} label={hearLabel} />
          </div>
          <Phonetic
            reading={item.reading}
            sayVi={item.sayVi}
            locale={locale}
            phoneticLabel={phoneticLabel}
            sayViLabel={sayViLabel}
          />
          {locale !== lang.slice(0, 2) && item.meaning[locale] ? (
            <p className="mt-2 text-sm text-ink-soft">{item.meaning[locale]}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function MatchGame({
  vocab,
  support,
  locale,
  unitId,
  matchedLabel,
  doneLabel,
  lang,
  onTap,
  onComplete,
}: {
  vocab: VocabItem[];
  support: Locale | null;
  locale: Locale;
  unitId?: string;
  matchedLabel: string;
  doneLabel?: string;
  lang?: string;
  onTap?: (text: string) => void;
  onComplete?: () => void;
}) {
  const cards = useMemo(() => {
    const picked = vocab.filter((item) => item.word).slice(0, 6);
    const raw: Card[] = [];
    picked.forEach((item, index) => {
      const back = (support ? item.meaning[support] : item.meaning[locale]) || item.reading || item.word;
      raw.push({ id: `a-${index}`, pair: item.word, face: item.word });
      raw.push({ id: `b-${index}`, pair: item.word, face: back });
    });
    return shuffle(raw, picked.map((item) => item.word).join("|"));
  }, [vocab, support, locale]);

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const total = Math.min(6, vocab.filter((item) => item.word).length);
  const finished = total > 0 && matched.length >= total;

  useEffect(() => {
    if (finished) onComplete?.();
  }, [finished, onComplete]);

  function tap(card: Card) {
    if (matched.includes(card.pair) || open.includes(card.id) || open.length === 2) return;
    if (lang) onTap?.(card.pair);
    const next = [...open, card.id];
    setOpen(next);
    if (next.length < 2) return;
    const [first, second] = next.map((id) => cards.find((item) => item.id === id)!);
    if (first.pair === second.pair && first.id !== second.id) {
      setMatched((prev) => [...prev, first.pair]);
      setOpen([]);
    } else {
      window.setTimeout(() => setOpen([]), 700);
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-sky-700">
        {matchedLabel}: {matched.length}/{total}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const shown = matched.includes(card.pair) || open.includes(card.id);
          return (
            <li key={card.id}>
              <button
                type="button"
                className={`control-tile learn-match-tile min-h-24 w-full items-center justify-center text-center ${
                  shown ? "is-active" : ""
                }`}
                onClick={() => tap(card)}
              >
                {shown ? (
                  <span className="grid justify-items-center gap-1">
                    <WordPicture
                      emoji={
                        vocab.find((item) => item.word === card.pair)
                          ? pictureForVocab(vocab.find((item) => item.word === card.pair)!, unitId || "")
                          : pictureFor(card.face, unitId || "")
                      }
                      size="sm"
                      label={card.face}
                    />
                    <span>{card.face}</span>
                  </span>
                ) : (
                  "?"
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {matched.length === total && total > 0 && doneLabel ? (
        <p className="mt-4 text-sm font-medium text-sky-700">{doneLabel}</p>
      ) : null}
    </div>
  );
}
