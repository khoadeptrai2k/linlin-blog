import { authenticateUser, createSession, serializeUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const user = await authenticateUser(body.email || "", body.password || "");
    if (!user) {
      return Response.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }
    await createSession(user._id);
    return Response.json({ user: serializeUser(user) });
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_UNAVAILABLE") {
      return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
    }
    return Response.json({ error: "LOGIN_FAILED" }, { status: 500 });
  }
}
