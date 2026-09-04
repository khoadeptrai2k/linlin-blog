"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "active" | "disabled";
  createdAt: string;
  lastLoginAt: string | null;
  level: string;
  track: string;
  goal: string;
  xp: number;
  streak: number;
  completedLessons: number;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export function AdminUsersTable({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUserRow[];
  currentUserId: string;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(keyword));
  }, [query, users]);

  async function toggleStatus(user: AdminUserRow) {
    const status = user.status === "active" ? "disabled" : "active";
    setBusyId(user.id);
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setUsers((items) => items.map((item) => item.id === user.id ? { ...item, status } : item));
    }
    setBusyId("");
  }

  return (
    <section className="admin-users">
      <div className="admin-users-head">
        <div>
          <p className="admin-eyebrow">{t("listEyebrow")}</p>
          <h2>{t("profilesTitle")}</h2>
        </div>
        <label className="admin-search">
          <SearchIcon />
          <span className="sr-only">{t("searchAria")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </label>
      </div>

      <div className="admin-table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t("colLearner")}</th>
              <th>{t("colPath")}</th>
              <th>{t("colProgress")}</th>
              <th>{t("colActivity")}</th>
              <th>{t("colStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-person">
                    <span>{user.name.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    {user.role === "admin" ? <em>{t("adminBadge")}</em> : null}
                  </div>
                </td>
                <td>
                  <b>{user.track.toUpperCase()} · {user.goal === "hsk" ? "HSK" : t("talk")}</b>
                  <small>{t("levelN", { level: user.level.toUpperCase() })}</small>
                </td>
                <td>
                  <b>{t("lessonsXp", { n: user.completedLessons, xp: user.xp })}</b>
                  <small>{t("streakDays", { n: user.streak })}</small>
                </td>
                <td>
                  <b>{user.lastLoginAt ? formatDate(user.lastLoginAt, locale) : t("neverLogin")}</b>
                  <small>{t("created", { date: formatDate(user.createdAt, locale) })}</small>
                </td>
                <td>
                  <button
                    type="button"
                    className={user.status === "active" ? "admin-status is-active" : "admin-status"}
                    disabled={busyId === user.id || user.id === currentUserId}
                    onClick={() => toggleStatus(user)}
                    title={user.id === currentUserId ? t("cannotLockSelf") : undefined}
                  >
                    <span />
                    {busyId === user.id ? t("saving") : user.status === "active" ? t("active") : t("locked")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length ? <p className="admin-empty">{t("empty")}</p> : null}
      </div>
    </section>
  );
}
