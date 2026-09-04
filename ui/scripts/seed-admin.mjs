import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const scrypt = promisify(scryptCallback);
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "linlin";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!uri || !email || !password || password.length < 8) {
  throw new Error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars) are required.");
}

const client = new MongoClient(uri);
await client.connect();

try {
  const db = client.db(dbName);
  const salt = randomBytes(16).toString("hex");
  const hash = ((await scrypt(password, salt, 64))).toString("hex");
  const now = new Date();

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  const result = await db.collection("users").findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Linlin Admin",
        passwordHash: hash,
        passwordSalt: salt,
        role: "admin",
        status: "active",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );

  await db.collection("learner_profiles").createIndex({ userId: 1 }, { unique: true });
  await db.collection("learner_profiles").updateOne(
    { userId: result._id },
    {
      $setOnInsert: {
        userId: result._id,
        level: "new",
        track: "zh",
        goal: "communicate",
        xp: 0,
        water: 0,
        streak: 0,
        missions: {},
        createdAt: now,
      },
      $set: { updatedAt: now },
    },
    { upsert: true },
  );

  console.log(`Admin ready: ${email}`);
} finally {
  await client.close();
}
