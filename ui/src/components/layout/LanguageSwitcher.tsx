/** @format */

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeMeta, routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ onOpenChange }: { compact?: boolean; onOpenChange?: (open: boolean) => void }) {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ top: 0, right: 16 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setBox({
      top: rect.bottom + 10,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
    };
  }, [open, close]);

  function toggle() {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  }

  function select(next: Locale) {
    router.replace(pathname, { locale: next });
    close();
  }

  const current = localeMeta[locale];
  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            <button
              type="button"
              className="sheet-scrim sheet-scrim-light"
              aria-label={t("closeMenu")}
              onClick={close}
            />
            <div
              className="glass-popup lang-panel popup-in"
              role="listbox"
              aria-label={t("switchLanguage")}
              style={{ top: box.top, right: box.right }}
            >
              <p className="px-1 pb-2.5 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
                {t("switchLanguage")}
              </p>
              <ul className="grid grid-cols-1 gap-2">
                {routing.locales.map((code) => {
                  const meta = localeMeta[code];
                  const active = code === locale;
                  return (
                    <div key={code} className="w-full">
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => select(code)}
                        className={`control-tile w-full ${active ? "is-active" : ""}`}
                        style={{flexDirection: "row", height: "fit-content", minHeight: "fit-content"}}
                      >
                        <span className="text-[0.68rem] h-fit font-semibold tracking-[0.16em] uppercase opacity-70">
                          {meta.short}
                        </span>
                        <span className="text-sm h-fit font-semibold">{meta.native}</span>
                      </button>
                    </div>
                  );
                })}
              </ul>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("switchLanguage")}
        onClick={toggle}
        className="island-chip"
      >
        {current.short}
      </button>
      {panel}
    </div>
  );
}
