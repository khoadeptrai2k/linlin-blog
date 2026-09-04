import { getAuthDb, getCurrentUser, toObjectId } from "@/lib/auth";

const tracks = new Set(["vi", "en", "zh", "th"]);
const goals = new Set(["communicate", "hsk"]);
const levels = new Set(["new", "a1", "a2", "b1"]);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  if (!db || !userId) return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  const profile = await db.collection("learner_profiles").findOne(
    { userId },
    { projection: { _id: 0, userId: 0 } },
  );
  return Response.json({ user, profile });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  if (!db || !userId) return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  const body = (await request.json()) as Record<string, unknown>;
  const existing = await db.collection("learner_profiles").findOne({ userId });
  const requestedLevel = levels.has(String(body.level)) ? String(body.level) : "new";
  const next = {
    level: existing?.placementDone ? existing.level : requestedLevel,
    track: tracks.has(String(body.track)) ? String(body.track) : "zh",
    goal: goals.has(String(body.goal)) ? String(body.goal) : "communicate",
    xp: Math.max(0, Number(body.xp) || 0),
    water: Math.min(12, Math.max(0, Number(body.water) || 0)),
    streak: Math.max(0, Number(body.streak) || 0),
    missions: typeof body.missions === "object" && body.missions ? body.missions : {},
    updatedAt: new Date(),
  };
  await db.collection("learner_profiles").updateOne(
    { userId },
    { $set: next, $setOnInsert: { userId, createdAt: new Date() } },
    { upsert: true },
  );
  return Response.json({ ok: true });
}
