import { createSession, registerUser, serializeUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const password = body.password || "";
    if (name.length < 2) {
      return Response.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 });
    }
    const { user } = await registerUser({ name, email, password });
    await createSession(user._id);
    return Response.json({ user: serializeUser(user) }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "EMAIL_EXISTS") {
      return Response.json({ error: "EMAIL_EXISTS" }, { status: 409 });
    }
    if (code === "DATABASE_UNAVAILABLE") {
      return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
    }
    return Response.json({ error: "REGISTER_FAILED" }, { status: 500 });
  }
}
