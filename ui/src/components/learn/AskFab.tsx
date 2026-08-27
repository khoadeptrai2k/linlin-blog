"use client";

function Wave({ thinking }: { thinking: boolean }) {
  return (
    <span className={`learn-ask-wave ${thinking ? "is-think" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function AskFab({
  open,
  thinking,
  count,
  openLabel,
  closeLabel,
  onToggle,
}: {
  open: boolean;
  thinking: boolean;
  count: number;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`learn-ask-fab ${open ? "is-open" : ""} ${thinking ? "is-think" : ""}`}
      data-ask-skip
      aria-expanded={open}
      aria-label={thinking ? openLabel : open ? closeLabel : openLabel}
      onClick={onToggle}
    >
      <Wave thinking={thinking} />
      {!open && count > 0 ? <span className="learn-ask-badge">{count > 9 ? "9+" : count}</span> : null}
    </button>
  );
}
