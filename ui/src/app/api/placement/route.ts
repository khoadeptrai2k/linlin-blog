import { getAuthDb, getCurrentUser, toObjectId } from "@/lib/auth";
import { getCatalog } from "@/lib/learn/store";
import { isLearnTrack } from "@/lib/learn/types";
import { placementQuestions, scorePlacement, startUnitForLevel } from "@/lib/learn/placement";

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

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const db = await getAuthDb();
  const userId = toObjectId(user.id);
  if (!db || !userId) return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });

  const body = (await request.json()) as { track?: string; answers?: Record<string, string> };
  const requested = body.track || "";
  const track = isLearnTrack(requested) ? requested : "zh";
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  const questions = placementQuestions(track);
  if (questions.some((item) => !answers[item.id])) {
    return Response.json({ error: "INCOMPLETE" }, { status: 400 });
  }
  const result = scorePlacement(track, answers);
  const catalog = await getCatalog();
  const units = catalog.tracks.find((item) => item.id === track)?.units || [];
  const startUnitId = startUnitForLevel(units, result.level);
  const startLessonId = units.find((item) => item.id === startUnitId)?.lessonIds[0];
  const now = new Date();
  await db.collection("learner_profiles").updateOne(
    { userId },
    {
      $set: {
        track,
        level: result.level,
        placementDone: true,
        placementScore: result.score,
        placementTotal: result.total,
        placementTrack: track,
        placementAt: now,
        updatedAt: now,
      },
      $setOnInsert: { userId, goal: "communicate", xp: 0, water: 0, streak: 0, missions: {}, createdAt: now },
    },
    { upsert: true },
  );
  return Response.json({ ...result, track, startUnitId, startLessonId });
}
