"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function GlassSheet({
  open,
  onClose,
  title,
  variant = "sheet",
  persistent = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  variant?: "sheet" | "drawer";
  persistent?: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open || persistent) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, persistent]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const isDrawer = variant === "drawer";
  const panel = (
    <div
      className={`glass-popup ${isDrawer ? "drawer-panel" : "sheet-panel"} ${isDrawer ? "drawer-in" : "popup-in"}`}
      role="dialog"
      aria-modal={persistent ? "false" : "true"}
      aria-label={title}
    >
      {isDrawer ? <div className="drawer-handle" aria-hidden /> : <div className="sheet-handle" />}
      {isDrawer ? (
        <button type="button" className="drawer-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
      ) : null}
      {title ? (
        <p className="px-1 pb-3 pr-10 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );

  return createPortal(
    <div className={`sheet-root${isDrawer ? " drawer-root" : ""}${persistent ? " is-docked" : ""}`}>
      {persistent ? null : <button type="button" className="sheet-scrim" aria-label="Close" onClick={onClose} />}
      {panel}
    </div>,
    document.body,
  );
}
