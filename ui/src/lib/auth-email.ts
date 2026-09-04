import {
  createLoginLink,
  findUserByEmail,
  registerUser,
  safeNextPath,
  serializeUser,
} from "@/lib/auth";
import { appBaseUrl, loginEmailCopy, sendMail } from "@/lib/mail";
import type { Locale } from "@/i18n/routing";

function localeOf(value: string | undefined): Locale {
  return value === "en" || value === "zh" || value === "th" ? value : "vi";
}

export async function issueLoginEmail(input: {
  email: string;
  locale?: string;
  nextPath?: string;
  name?: string;
}) {
  const user = await findUserByEmail(input.email);
  if (!user) return { emailed: true as const };
  const locale = localeOf(input.locale);
  const nextPath = safeNextPath(input.nextPath);
  const token = await createLoginLink({ userId: user._id, locale, nextPath });
  const link = `${appBaseUrl()}/api/auth/magic?token=${encodeURIComponent(token)}&locale=${locale}`;
  const copy = loginEmailCopy(locale, input.name || user.name, link);
  const mail = await sendMail({ to: user.email, ...copy });
  return {
    emailed: true as const,
    sent: mail.sent,
    devLink: mail.sent || process.env.NODE_ENV === "production" ? undefined : link,
  };
}

export async function registerAndEmail(input: {
  name: string;
  email: string;
  password?: string;
  locale?: string;
  nextPath?: string;
}) {
  const { user } = await registerUser({
    name: input.name,
    email: input.email,
    password: input.password,
  });
  const mail = await issueLoginEmail({
    email: user.email,
    locale: input.locale,
    nextPath: input.nextPath,
    name: user.name,
  });
  return { user: serializeUser(user), ...mail };
}
