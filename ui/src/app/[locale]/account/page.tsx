import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AccountClient } from "@/components/account/AccountClient";
import { isLocale } from "@/i18n/routing";
import { getCurrentUser, safeNextPath } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const query = await searchParams;
  const user = await getCurrentUser();

  return (
    <AccountClient
      initialUser={user}
      nextPath={safeNextPath(query.next, "/learn/placement")}
      startError={query.error || ""}
    />
  );
}
