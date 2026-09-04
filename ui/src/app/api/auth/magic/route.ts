import { NextRequest } from "next/server";
import { consumeLoginToken, createSession, safeNextPath } from "@/lib/auth";
import { issueLoginEmail } from "@/lib/auth-email";

function localePrefix(locale: string | null | undefined) {
  return locale === "en" || locale === "zh" || locale === "th" ? `/${locale}` : "";
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const origin = request.nextUrl.origin;
  const localeHint = request.nextUrl.searchParams.get("locale");
  try {
    const result = await consumeLoginToken(token);
    if (!result) {
      return Response.redirect(new URL(`${localePrefix(localeHint)}/account?error=LINK_EXPIRED`, origin));
    }
    await createSession(result.user._id);
    const next = safeNextPath(result.nextPath, "/learn/placement");
    return Response.redirect(new URL(`${localePrefix(result.locale)}${next}`, origin));
  } catch {
    return Response.redirect(new URL(`${localePrefix(localeHint)}/account?error=LOGIN_FAILED`, origin));
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; locale?: string; next?: string };
    const email = body.email?.trim() || "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }
    const result = await issueLoginEmail({
      email,
      locale: body.locale,
      nextPath: body.next,
    });
    return Response.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_UNAVAILABLE") {
      return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
    }
    return Response.json({ error: "LOGIN_FAILED" }, { status: 500 });
  }
}
