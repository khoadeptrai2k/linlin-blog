import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/AdminUsersTable";
import { isLocale } from "@/i18n/routing";
import { getAuthDb, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type UserAggregate = {
  _id: { toHexString(): string };
  name: string;
  email: string;
  role: "student" | "admin";
  status: "active" | "disabled";
  createdAt: Date;
  lastLoginAt?: Date;
  profile?: {
    level?: string;
    track?: string;
    goal?: string;
    xp?: number;
    streak?: number;
  };
  progress?: { lessonIds?: string[] };
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect({ href: "/account", locale });
  if (currentUser.role !== "admin") return redirect({ href: "/learn", locale });

  const t = await getTranslations("Admin");
  const accountT = await getTranslations("Account");
  const db = await getAuthDb();
  const rows = db
    ? await db.collection("users").aggregate<UserAggregate>([
        { $sort: { createdAt: -1 } },
        { $lookup: { from: "learner_profiles", localField: "_id", foreignField: "userId", as: "profileRows" } },
        { $lookup: { from: "learning_progress", localField: "_id", foreignField: "userId", as: "progressRows" } },
        {
          $set: {
            profile: { $first: "$profileRows" },
            progress: {
              lessonIds: {
                $reduce: {
                  input: "$progressRows.lessonIds",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
            },
          },
        },
        { $unset: ["passwordHash", "passwordSalt", "profileRows", "progressRows"] },
      ]).toArray()
    : [];

  const users: AdminUserRow[] = rows.map((user) => ({
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    level: user.profile?.level ?? "new",
    track: user.profile?.track ?? "zh",
    goal: user.profile?.goal ?? "communicate",
    xp: user.profile?.xp ?? 0,
    streak: user.profile?.streak ?? 0,
    completedLessons: user.progress?.lessonIds?.length ?? 0,
  }));

  const activeCount = users.filter((user) => user.status === "active").length;
  const learningCount = users.filter((user) => user.completedLessons > 0).length;
  const totalXp = users.reduce((sum, user) => sum + user.xp, 0);

  return (
    <div className="admin-page">
      <header className="admin-hero">
        <div>
          <p className="admin-eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("lead")}</p>
        </div>
        <Link href="/account" className="admin-profile-link">
          <span>{currentUser.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <small>{accountT("admin")}</small>
            <b>{currentUser.name}</b>
          </div>
        </Link>
      </header>

      <section className="admin-stats" aria-label={t("statsAria")}>
        <article>
          <span className="admin-stat-icon">01</span>
          <div><strong>{users.length}</strong><p>{t("totalAccounts")}</p></div>
          <small>{t("totalHint")}</small>
        </article>
        <article>
          <span className="admin-stat-icon">02</span>
          <div><strong>{activeCount}</strong><p>{t("active")}</p></div>
          <small>{t("startedHint", { n: learningCount })}</small>
        </article>
        <article>
          <span className="admin-stat-icon">03</span>
          <div><strong>{totalXp}</strong><p>{t("totalXp")}</p></div>
          <small>{t("xpHint")}</small>
        </article>
      </section>

      <AdminUsersTable initialUsers={users} currentUserId={currentUser.id} />
    </div>
  );
}
