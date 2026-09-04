import { getAuthDb, getCurrentUser, toObjectId } from "@/lib/auth";

const tracks = new Set(["vi", "en", "zh", "th"]);

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const track = new URL(request.url).searchParams.get("track") || "";
  if (!tracks.has(track)) return Response.json({ error: "INVALID_TRACK" }, { status: 400 });
  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  if (!db || !userId) return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  const progress = await db.collection("learning_progress").findOne(
    { userId, track },
    { projection: { _id: 0, lessonIds: 1 } },
  );
  const done = Object.fromEntries(
    ((progress?.lessonIds as string[] | undefined) || []).map((lessonId) => [lessonId, true]),
  );
  return Response.json({ done });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = (await request.json()) as { track?: string; lessonId?: string };
  const track = body.track || "";
  const lessonId = body.lessonId?.trim() || "";
  if (!tracks.has(track) || !lessonId || lessonId.length > 160) {
    return Response.json({ error: "INVALID_PROGRESS" }, { status: 400 });
  }
  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  if (!db || !userId) return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  const existing = await db.collection("learning_progress").findOne({ userId, track, lessonIds: lessonId });
  await db.collection("learning_progress").updateOne(
    { userId, track },
    {
      $addToSet: { lessonIds: lessonId },
      $set: { updatedAt: new Date() },
      $setOnInsert: { userId, track, createdAt: new Date() },
    },
    { upsert: true },
  );
  if (!existing) {
    await db.collection("learner_profiles").updateOne(
      { userId },
      { $inc: { xp: 10 }, $set: { updatedAt: new Date() }, $setOnInsert: { userId, createdAt: new Date() } },
      { upsert: true },
    );
  }
  return Response.json({ ok: true });
}
