"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { AuthUser } from "@/lib/auth";

type Mode = "login" | "register";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function AccountClient({
  initialUser,
  nextPath = "/learn/placement",
  startError = "",
}: {
  initialUser: AuthUser | null;
  nextPath?: string;
  startError?: string;
}) {
  const t = useTranslations("Account");
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    startError === "LINK_EXPIRED" ? t("linkExpired") : startError === "LOGIN_FAILED" ? t("genericError") : "",
  );
  const [busy, setBusy] = useState(false);
  const [inbox, setInbox] = useState<{ email: string; devLink?: string } | null>(null);

  function errorMessage(code?: string) {
    if (code === "EMAIL_EXISTS") return t("emailExists");
    if (code === "INVALID_CREDENTIALS") return t("invalidCredentials");
    if (code === "NAME_TOO_SHORT") return t("nameTooShort");
    if (code === "INVALID_EMAIL") return t("invalidEmail");
    if (code === "PASSWORD_TOO_SHORT") return t("passwordTooShort");
    if (code === "DATABASE_UNAVAILABLE") return t("databaseUnavailable");
    return t("genericError");
  }

  async function sendMagic() {
    const response = await fetch("/api/auth/magic", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, locale, next: nextPath }),
    });
    const result = (await response.json()) as { error?: string; devLink?: string };
    if (!response.ok) {
      setMessage(errorMessage(result.error));
      return false;
    }
    setInbox({ email, devLink: result.devLink });
    return true;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, password: password || undefined, locale, next: nextPath }),
        });
        const result = (await response.json()) as { error?: string; devLink?: string };
        if (!response.ok) {
          setMessage(errorMessage(result.error));
          return;
        }
        setInbox({ email, devLink: result.devLink });
        return;
      }

      if (password) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const result = (await response.json()) as { user?: AuthUser; error?: string };
        if (!response.ok || !result.user) {
          setMessage(errorMessage(result.error));
          return;
        }
        setUser(result.user);
        router.push(nextPath);
        router.refresh();
        return;
      }

      await sendMagic();
    } catch {
      setMessage(t("offline"));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setBusy(false);
    router.refresh();
  }

  if (user) {
    return (
      <section className="account-shell">
        <div className="account-signed">
          <span className="account-signed-mark">{user.name.slice(0, 1).toUpperCase()}</span>
          <p className="account-eyebrow">{t("eyebrow")}</p>
          <h1>{t("hello", { name: user.name })}</h1>
          <p>{t("syncedLead")}</p>
          <dl className="account-summary">
            <div>
              <dt>{t("email")}</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>{t("role")}</dt>
              <dd>{user.role === "admin" ? t("admin") : t("student")}</dd>
            </div>
          </dl>
          <div className="account-actions">
            <Link href={nextPath} className="account-primary">
              {t("continueLearn")} <ArrowIcon />
            </Link>
            {user.role === "admin" ? (
              <Link href="/admin" className="account-secondary">
                {t("manageLearners")}
              </Link>
            ) : null}
            <button type="button" className="account-quiet" onClick={logout} disabled={busy}>
              {t("logout")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (inbox) {
    return (
      <section className="account-shell">
        <div className="account-signed">
          <span className="account-signed-mark">✉</span>
          <p className="account-eyebrow">{t("checkEmailEyebrow")}</p>
          <h1>{t("checkEmailTitle")}</h1>
          <p>{t("checkEmailLead", { email: inbox.email })}</p>
          {inbox.devLink ? (
            <p className="account-dev-link">
              <a href={inbox.devLink}>{t("devLoginLink")}</a>
            </p>
          ) : null}
          <div className="account-actions">
            <button type="button" className="account-primary" onClick={() => { setInbox(null); setMode("login"); }}>
              {t("backToLogin")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-shell">
      <div className="account-layout">
        <div className="account-story">
          <Link href="/" className="account-brand" aria-label={t("homeAria")}>
            <span>琳</span> Linlin
          </Link>
          <div>
            <p className="account-eyebrow">{t("storyEyebrow")}</p>
            <h1>{t("storyTitle")}</h1>
            <p className="account-story-lead">{t("storyLead")}</p>
          </div>
          <ul className="account-benefits">
            <li><CheckIcon /><span><b>{t("benefit1Bold")}</b>{t("benefit1")}</span></li>
            <li><CheckIcon /><span><b>{t("benefit2Bold")}</b>{t("benefit2")}</span></li>
            <li><CheckIcon /><span><b>{t("benefit3Bold")}</b>{t("benefit3")}</span></li>
          </ul>
        </div>

        <div className="account-form-panel">
          <div className="account-mode" role="tablist" aria-label={t("modeAria")}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "is-active" : ""}
              onClick={() => { setMode("login"); setMessage(""); }}
            >
              {t("login")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={mode === "register" ? "is-active" : ""}
              onClick={() => { setMode("register"); setMessage(""); }}
            >
              {t("register")}
            </button>
          </div>

          <div className="account-form-copy">
            <span>{mode === "login" ? t("welcomeBack") : t("startFree")}</span>
            <h2>{mode === "login" ? t("loginTitle") : t("registerTitle")}</h2>
            <p className="account-form-hint">{mode === "register" ? t("registerEmailHint") : t("loginEmailHint")}</p>
          </div>

          <form className="account-form" onSubmit={submit}>
            {mode === "register" ? (
              <label>
                <span>{t("displayName")}</span>
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("namePlaceholder")}
                  minLength={2}
                  required
                />
              </label>
            ) : null}
            <label>
              <span>{t("email")}</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ban@example.com"
                required
              />
            </label>
            <label>
              <span>{t("passwordOptional")}</span>
              <input
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("passwordOptionalPlaceholder")}
                minLength={password ? 8 : undefined}
              />
            </label>
            {message ? <p className="account-error" role="alert">{message}</p> : null}
            <button type="submit" className="account-submit" disabled={busy}>
              {busy ? t("busy") : mode === "login" ? (password ? t("login") : t("sendLoginEmail")) : t("createAccount")}
              {!busy ? <ArrowIcon /> : null}
            </button>
          </form>

          <p className="account-switch">
            {mode === "login" ? t("noAccount") : t("hasAccount")}
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? t("registerNow") : t("login")}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
