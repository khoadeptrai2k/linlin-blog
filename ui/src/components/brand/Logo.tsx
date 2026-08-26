import { useId } from "react";
import { Link } from "@/i18n/navigation";

function LogoMark({ gid }: { gid: string }) {
  const g = (name: string) => `${gid}-${name}`;

  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={g("wash")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7EC8E3" />
          <stop offset="100%" stopColor="#2B96B8" />
        </linearGradient>
        <linearGradient id={g("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2C98A" />
          <stop offset="100%" stopColor="#C4A24A" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="22" fill={`url(#${g("wash")})`} />
      <circle
        cx="40"
        cy="36"
        r="16"
        fill="none"
        stroke={`url(#${g("gold")})`}
        strokeWidth="1.4"
      />
      <circle cx="40" cy="36" r="7.5" fill={`url(#${g("gold")})`} />
      <path
        d="M18 54c11-8 21-8 22-1v16c-9-4-16-4-22 2V54z"
        fill="#FFFBF4"
      />
      <path
        d="M62 54c-11-8-21-8-22-1v16c9-4 16-4 22 2V54z"
        fill="#F6EFE2"
      />
      <path
        d="M40 53v16"
        fill="none"
        stroke="#C4A24A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  compact = false,
  tone = "light",
}: {
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const gid = useId().replace(/:/g, "");
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label="Học cùng Linlin"
      className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    >
      <span className="grid h-8 w-8 shrink-0 overflow-hidden rounded-[0.8rem]">
        <LogoMark gid={gid} />
      </span>
      {!compact && (
        <span
          className={`font-display text-[1.15rem] leading-none ${
            onDark ? "text-white" : "text-sky-700"
          }`}
        >
          Linlin
        </span>
      )}
    </Link>
  );
}
