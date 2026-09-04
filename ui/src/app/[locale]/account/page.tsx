import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AccountClient } from "@/components/account/AccountClient";
import { isLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();

  return <AccountClient initialUser={user} />;
}
