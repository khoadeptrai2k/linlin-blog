"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

function iconProps(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

function AboutIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.6 19.2c1.2-3.1 3.4-4.6 6.4-4.6s5.2 1.5 6.4 4.6" />
    </svg>
  );
}

function MethodIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4.5 16.5c2.8-1.2 3.6-5.2 6.8-5.2 2.2 0 2.6 3.4 5.2 3.4 2.4 0 3-2.6 3.5-4.7" />
      <circle cx="5.2" cy="17.2" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="11.2" cy="10.6" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="16.6" cy="14.4" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ScenesIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3.6" y="4.4" width="7.2" height="7.2" rx="2.1" />
      <rect x="13.2" y="4.4" width="7.2" height="7.2" rx="2.1" />
      <rect x="3.6" y="12.4" width="7.2" height="7.2" rx="2.1" />
      <rect x="13.2" y="12.4" width="7.2" height="7.2" rx="2.1" />
    </svg>
  );
}

function BlogsIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M7 4.8h7.4L19 9.2v10a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 19V6A1.2 1.2 0 0 1 7 4.8z" />
      <path d="M14.2 4.8V9h4.4" />
      <path d="M8.6 12.4h6.8M8.6 15.6h4.6" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4.6 9.4 12 5.8l7.4 3.6L12 13z" />
      <path d="M7.4 11.2v4.2c0 .7 2.1 2.2 4.6 2.2s4.6-1.5 4.6-2.2v-4.2" />
      <path d="M19.4 9.6v5.6" />
    </svg>
  );
}

const links = [
  { href: "/#about" as const, key: "about" as const, icon: AboutIcon },
  { href: "/#method" as const, key: "method" as const, icon: MethodIcon },
  { href: "/#scenes" as const, key: "scenes" as const, icon: ScenesIcon },
  { href: "/blogs" as const, key: "blogs" as const, icon: BlogsIcon },
  { href: "/learn" as const, key: "learn" as const, icon: LearnIcon },
];

export function SiteHeader() {
  const t = useTranslations("Nav");
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const expanded = !scrolled || hovered || langOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!scrolled) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setHovered(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [scrolled]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <div
        ref={rootRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        className={`island pointer-events-auto rounded-full ${
          expanded ? "is-open" : "is-closed"
        }`}
      >
        <Logo compact />
        <span className="island-name font-display whitespace-nowrap text-[1.05rem] leading-none text-[var(--deep)]">
          Linlin
        </span>
        <span className="mx-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[linear-gradient(180deg,#9bbfd6,#2f6f8f)]" />
        <nav className="island-nav" aria-label={t("home")}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-label={t(link.key)}
                className="island-link"
              >
                <Icon />
                <span className="island-label" aria-hidden="true">
                  {t(link.key)}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center">
          <LanguageSwitcher compact={!expanded} onOpenChange={setLangOpen} />
        </div>
      </div>
    </header>
  );
}
