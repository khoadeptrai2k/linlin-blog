export function Wave({
  from = "#f4eee3",
  to = "#eef6fb",
}: {
  from?: string;
  to?: string;
}) {
  return (
    <svg
      className="wave"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill={from} d="M0 0h1440v120H0z" />
      <path
        fill={to}
        d="M0 58c95 42 190-36 285-14 95 22 142 78 248 52 106-26 180-88 286-62 106 26 148 90 254 64s190-82 277-48c87 34 90 70 90 70V120H0V58z"
      />
      <path
        fill="none"
        stroke="#9bbfd6"
        strokeOpacity="0.45"
        strokeWidth="2.2"
        d="M0 72c120-38 240 38 360 8 120-30 180-70 320-42 140 28 200 78 340 46 140-32 220-86 420-22"
      />
    </svg>
  );
}
