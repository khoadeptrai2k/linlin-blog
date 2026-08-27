"use client";

import { SpeakButton } from "@/components/learn/LearnAudio";
import { CardDrawer, type CardDrawerTile } from "@/components/ui/CardDrawer";
import type { Locale } from "@/i18n/routing";
import type { TapRecord } from "@/lib/learn/history";

export function TapHistory({
  open,
  thinking,
  items,
  slow,
  labels,
  onClose,
  onClear,
}: {
  open: boolean;
  thinking?: boolean;
  items: TapRecord[];
  locale: Locale;
  slow: boolean;
  labels: {
    title: string;
    empty: string;
    close: string;
    clear: string;
    hear: string;
    youAsked: string;
    reply: string;
    replyStub: string;
    thinking: string;
    translation: string;
    explain: string;
    phonetic: string;
    sayVi: string;
    count: string;
  };
  onClose: () => void;
  onClear: () => void;
}) {
  const latest = items[0];
  const older = items.slice(1);
  const body = latest
    ? latest.translation || latest.explain || latest.answer || labels.replyStub
    : labels.empty;

  const tiles: CardDrawerTile[] = [];
  if (!thinking && latest?.translation && latest.explain) {
    tiles.push({ label: labels.explain, value: latest.explain, wide: true });
  }
  if (!thinking && latest?.reading) tiles.push({ label: labels.phonetic, value: latest.reading });
  if (!thinking && latest?.sayVi) tiles.push({ label: labels.sayVi, value: latest.sayVi });

  return (
    <CardDrawer
      open={open}
      onClose={onClose}
      persistent
      eyebrow={labels.title}
      title={latest?.ask || labels.title}
      body={thinking ? undefined : body}
      tiles={tiles}
    >
      {thinking ? (
        <div className="learn-ask-think" aria-live="polite">
          <span className="learn-ask-wave is-think" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <p>{labels.thinking}</p>
        </div>
      ) : null}

      {!thinking && latest ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-soft">{labels.count}</p>
          <SpeakButton text={latest.ask} lang={latest.lang} slow={slow} label={labels.hear} />
        </div>
      ) : null}
      {!thinking && !latest ? <p className="mt-4 text-xs text-ink-soft">{labels.count}</p> : null}
      {!thinking && latest ? <p className="mt-2 text-xs text-ink-soft">{labels.replyStub}</p> : null}

      {!thinking && older.length ? (
        <>
          <p className="mt-5 px-1 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            {labels.youAsked}
          </p>
          <ol className="mt-2 space-y-2">
            {older.map((item) => (
              <li key={`${item.id}-${item.at}`} className="control-tile min-h-0">
                <span className="font-display text-lg leading-6 text-sky-700">{item.ask}</span>
                {item.translation ? <span className="text-sm leading-6 text-ink-soft">{item.translation}</span> : null}
                {!item.translation && item.explain ? (
                  <span className="text-sm leading-6 text-ink-soft">{item.explain}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {!thinking && items.length ? (
        <button type="button" className="btn-ghost mt-4 w-full" onClick={onClear}>
          {labels.clear}
        </button>
      ) : null}
    </CardDrawer>
  );
}
