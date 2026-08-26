"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeMeta, routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({
  compact = false,
  onOpenChange,
}: {
  compact?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        onOpenChange?.(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onOpenChange]);

  function toggle() {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  }

  function select(next: Locale) {
    router.replace(pathname, { locale: next });
    setOpen(false);
    onOpenChange?.(false);
  }

  const current = localeMeta[locale];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("switchLanguage")}
        onClick={toggle}
        className="island-chip"
      >
        {current.short}
      </button>
      {open && !compact && (
        <div className="glass-popup popup-in pebble-b absolute right-0 top-[calc(100%+0.7rem)] z-50 w-[17.5rem] p-3">
          <p className="px-1 pb-2 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            {t("switchLanguage")}
          </p>
          <ul role="listbox" className="grid grid-cols-2 gap-2">
            {routing.locales.map((code) => {
              const meta = localeMeta[code];
              const active = code === locale;
              return (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => select(code)}
                    className={`control-tile ${active ? "is-active" : ""}`}
                  >
                    <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                      {meta.short}
                    </span>
                    <span className="text-sm font-semibold">{meta.native}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
