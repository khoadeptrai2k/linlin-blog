import { NextResponse } from "next/server";
import { getAuthDb, getCurrentUser, toObjectId } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { id } = await context.params;
  if (id === currentUser.id) {
    return NextResponse.json({ error: "CANNOT_DISABLE_SELF" }, { status: 400 });
  }

  const objectId = toObjectId(id);
  if (!objectId) return NextResponse.json({ error: "INVALID_USER" }, { status: 400 });
  const body = (await request.json()) as { status?: "active" | "disabled" };
  if (body.status !== "active" && body.status !== "disabled") {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const db = await getAuthDb();
  if (!db) return NextResponse.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  const result = await db.collection("users").updateOne(
    { _id: objectId },
    { $set: { status: body.status, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: result.matchedCount === 1 });
}
