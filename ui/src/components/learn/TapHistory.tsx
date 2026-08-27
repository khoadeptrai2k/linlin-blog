"use client";

import { Phonetic, SpeakButton } from "@/components/learn/LearnAudio";
import type { Locale } from "@/i18n/routing";
import type { TapRecord } from "@/lib/learn/history";

export function TapHistory({
  open,
  items,
  locale,
  slow,
  labels,
  onClose,
  onClear,
}: {
  open: boolean;
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
    translation: string;
    explain: string;
    phonetic: string;
    sayVi: string;
    count: string;
  };
  onClose: () => void;
  onClear: () => void;
}) {
  return (
    <aside className={`learn-history ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="learn-history-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="learn-kicker">{labels.title}</p>
            <p className="mt-1 text-xs text-ink-soft">{labels.count}</p>
          </div>
          <div className="flex items-center gap-2">
            {items.length ? (
              <button type="button" className="learn-speed" onClick={onClear}>
                {labels.clear}
              </button>
            ) : null}
            <button type="button" className="learn-speed lg:hidden" onClick={onClose}>
              {labels.close}
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="mt-6 text-sm leading-6 text-ink-soft">{labels.empty}</p>
        ) : (
          <ol className="mt-4 grid gap-3">
            {items.map((item) => {
              const ask = item.ask || item.text || "";
              return (
                <li key={`${item.id}-${item.at}`} className="learn-history-item">
                  <p className="learn-kicker">{labels.youAsked}</p>
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <p className="font-display text-lg leading-6 text-sky-700">{ask}</p>
                    <SpeakButton text={ask} lang={item.lang} slow={slow} label={labels.hear} />
                  </div>
                  <Phonetic
                    reading={item.reading}
                    sayVi={item.sayVi}
                    locale={locale}
                    phoneticLabel={labels.phonetic}
                    sayViLabel={labels.sayVi}
                  />
                  <div className="learn-ask-reply">
                    <p className="learn-kicker">{labels.reply}</p>
                    {item.translation ? <p className="mt-1 leading-6">{item.translation}</p> : null}
                    {item.explain ? <p className="mt-1 text-sm leading-6 text-ink-soft">{item.explain}</p> : null}
                    {!item.translation && !item.explain && item.answer ? (
                      <p className="mt-1 leading-6 text-ink-soft">{item.answer}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-ink-soft">{labels.replyStub}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </aside>
  );
}
