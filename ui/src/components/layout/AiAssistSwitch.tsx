"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getAiAssist, getAiAssistServer, setAiAssist, subscribeAiAssist } from "@/lib/learn/aiAssist";

export function AiAssistSwitch() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const on = useSyncExternalStore(subscribeAiAssist, getAiAssist, getAiAssistServer);
  const onLearn = pathname === "/learn" || pathname.startsWith("/learn/");

  if (!onLearn) return null;

  return (
    <button
      type="button"
      className={`island-chip ${on ? "is-on" : ""}`}
      aria-pressed={on}
      aria-label={on ? t("aiOff") : t("aiOn")}
      onClick={() => setAiAssist(!on)}
    >
      AI
    </button>
  );
}
