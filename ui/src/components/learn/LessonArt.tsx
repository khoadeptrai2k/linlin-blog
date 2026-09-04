"use client";

import { SpeakButton, speakPair } from "@/components/learn/LearnAudio";
import { localeMeta, type Locale } from "@/i18n/routing";
import { UI_SPEECH } from "@/lib/learn/language";
import { pictureFor, pictureForSentence, pictureForVocab, unitArt } from "@/lib/learn/picture";
import type { Lesson, SentenceItem, VocabItem } from "@/lib/learn/types";

export function UnitScene({
  unitId,
  title,
  caption,
}: {
  unitId: string;
  title: string;
  caption?: string;
}) {
  const art = unitArt(unitId);
  return (
    <div className={`learn-scene is-${art.mood}`} aria-hidden="false">
      <span className="learn-scene-sticker is-a">{art.stickers[0]}</span>
      <span className="learn-scene-sticker is-b">{art.stickers[1]}</span>
      <span className="learn-scene-sticker is-c">{art.stickers[2]}</span>
      <span className="learn-scene-hero">{art.emoji}</span>
      <span className="learn-scene-linlin" title="Linlin">
        琳
      </span>
      <div className="learn-scene-copy">
        <p className="learn-kicker">{title}</p>
        {caption ? <p>{caption}</p> : null}
      </div>
    </div>
  );
}

export function WordPicture({
  emoji,
  size = "md",
  label,
}: {
  emoji: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  return (
    <span className={`learn-pic is-${size}`} role="img" aria-label={label || emoji}>
      {emoji}
    </span>
  );
}

export function VocabStrip({
  lesson,
  locale,
  onSay,
}: {
  lesson: Lesson;
  locale: Locale;
  onSay?: (text: string) => void;
}) {
  const rows = lesson.vocab.slice(0, 8);
  if (!rows.length) return null;
  return (
    <ul className="learn-pic-row">
      {rows.map((item) => {
        const gloss = item.meaning[locale] && item.meaning[locale] !== item.word ? item.meaning[locale] : "";
        return (
          <li key={item.word}>
            <button
              type="button"
              className="learn-pic-card"
              onClick={() => {
                speakPair(item.word, lesson.speechLang, gloss, UI_SPEECH[locale]);
                onSay?.(item.word);
              }}
            >
              <WordPicture emoji={pictureForVocab(item, lesson.unitId)} label={item.word} size="md" />
              <b>{item.word}</b>
              {gloss ? <small>{gloss}</small> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ExampleShot({
  item,
  lesson,
  locale,
  slow,
  onSay,
}: {
  item: SentenceItem;
  lesson: Lesson;
  locale: Locale;
  slow: boolean;
  onSay: (text: string) => void;
}) {
  const native = localeMeta[lesson.track].native;
  const gloss = item.meaning[locale]?.trim() && item.meaning[locale] !== item.text ? item.meaning[locale] : undefined;
  return (
    <article className="learn-shot">
      <WordPicture emoji={pictureForSentence(item, lesson.unitId)} label={item.text} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="learn-kicker">{native}</p>
        <p className="learn-shot-line">{item.text}</p>
        {item.reading ? <p className="learn-shot-read">{item.reading}</p> : null}
        {gloss ? <p className="learn-shot-gloss">{gloss}</p> : null}
      </div>
      <SpeakButton
        text={item.text}
        lang={lesson.speechLang}
        slow={slow}
        label={gloss || item.text}
        explain={gloss}
        uiLang={UI_SPEECH[locale]}
        onHeard={onSay}
      />
    </article>
  );
}

export function pictureOf(lesson: Lesson, text: string, locale: Locale) {
  const word = lesson.vocab.find((item) => item.word.trim() === text.trim());
  if (word) return pictureForVocab(word, lesson.unitId);
  const line = lesson.sentences.find((item) => item.text.trim() === text.trim());
  if (line) return pictureForSentence(line, lesson.unitId);
  const meaningHit = lesson.vocab.find((item) => item.meaning[locale]?.trim() === text.trim());
  if (meaningHit) return pictureForVocab(meaningHit, lesson.unitId);
  return pictureFor(text, lesson.unitId);
}

export function optionPicture(option: string, vocab: VocabItem[], unitId: string, locale: Locale) {
  const hit =
    vocab.find((item) => item.word.trim() === option.trim()) ||
    vocab.find((item) => item.meaning[locale]?.trim() === option.trim());
  if (hit) return pictureForVocab(hit, unitId);
  return pictureFor(option, unitId);
}
