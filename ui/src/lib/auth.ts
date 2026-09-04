import "server-only";

import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ObjectId, type Db } from "mongodb";
import { getMongo } from "@/lib/mongo";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "linlin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

export type UserRole = "student" | "admin";

type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  role: UserRole;
  status: "active" | "disabled";
  createdAt: Date;
  lastLoginAt?: Date;
};

type SessionDocument = {
  _id: ObjectId;
  tokenHash: string;
  userId: ObjectId;
  createdAt: Date;
  expiresAt: Date;
};

type LoginTokenDocument = {
  _id: ObjectId;
  tokenHash: string;
  userId: ObjectId;
  locale: string;
  nextPath: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled";
  createdAt: string;
};

let indexesPromise: Promise<void> | null = null;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function publicUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}

async function authDb() {
  const db = await getMongo();
  if (!db) return null;
  if (!indexesPromise) {
    indexesPromise = Promise.all([
      db.collection<UserDocument>("users").createIndex({ email: 1 }, { unique: true }),
      db.collection<SessionDocument>("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection<SessionDocument>("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection<LoginTokenDocument>("login_tokens").createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection<LoginTokenDocument>("login_tokens").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection("learner_profiles").createIndex({ userId: 1 }, { unique: true }),
      db.collection("learning_progress").createIndex({ userId: 1, track: 1 }, { unique: true }),
    ]).then(() => undefined);
  }
  await indexesPromise;
  return db;
}

export async function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return { hash: derived.toString("hex"), salt };
}

export async function verifyPassword(password: string, salt: string, expected: string) {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expectedBuffer = Buffer.from(expected, "hex");
  return expectedBuffer.length === derived.length && timingSafeEqual(expectedBuffer, derived);
}

export async function createSession(userId: ObjectId) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  await db.collection<SessionDocument>("sessions").insertOne({
    _id: new ObjectId(),
    tokenHash: tokenHash(token),
    userId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_SECONDS * 1000),
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
    priority: "high",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const db = await authDb();
  if (db && token) {
    await db.collection<SessionDocument>("sessions").deleteOne({ tokenHash: tokenHash(token) });
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await authDb();
  if (!db) return null;
  const session = await db.collection<SessionDocument>("sessions").findOne({
    tokenHash: tokenHash(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;
  const user = await db.collection<UserDocument>("users").findOne({ _id: session.userId });
  if (!user || user.status !== "active") return null;
  return publicUser(user);
}

export async function registerUser(input: { name: string; email: string; password?: string }) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const email = normalizeEmail(input.email);
  if (await db.collection<UserDocument>("users").findOne({ email })) {
    throw new Error("EMAIL_EXISTS");
  }
  const password = input.password ? await hashPassword(input.password) : null;
  const now = new Date();
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const result = await db.collection<UserDocument>("users").insertOne({
    _id: new ObjectId(),
    name: input.name.trim(),
    email,
    ...(password ? { passwordHash: password.hash, passwordSalt: password.salt } : {}),
    role: email === adminEmail ? "admin" : "student",
    status: "active",
    createdAt: now,
  });
  await db.collection("learner_profiles").updateOne(
    { userId: result.insertedId },
    {
      $setOnInsert: {
        userId: result.insertedId,
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
  const user = await db.collection<UserDocument>("users").findOne({ _id: result.insertedId });
  if (!user) throw new Error("USER_CREATE_FAILED");
  return { db, user };
}

export async function authenticateUser(emailValue: string, password: string) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const email = normalizeEmail(emailValue);
  const user = await db.collection<UserDocument>("users").findOne({ email });
  if (!user || user.status !== "active" || !user.passwordHash || !user.passwordSalt) return null;
  if (!(await verifyPassword(password, user.passwordSalt, user.passwordHash))) return null;
  await db.collection<UserDocument>("users").updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date() } },
  );
  return user;
}

export async function findUserByEmail(emailValue: string) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const user = await db.collection<UserDocument>("users").findOne({
    email: normalizeEmail(emailValue),
    status: "active",
  });
  return user;
}

export async function createLoginLink(input: { userId: ObjectId; locale: string; nextPath: string }) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  await db.collection<LoginTokenDocument>("login_tokens").insertOne({
    _id: new ObjectId(),
    tokenHash: tokenHash(token),
    userId: input.userId,
    locale: input.locale,
    nextPath: input.nextPath,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 30 * 60 * 1000),
  });
  return token;
}

export async function consumeLoginToken(token: string) {
  const db = await authDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const row = await db.collection<LoginTokenDocument>("login_tokens").findOne({
    tokenHash: tokenHash(token),
    expiresAt: { $gt: new Date() },
    usedAt: { $exists: false },
  });
  if (!row) return null;
  await db.collection<LoginTokenDocument>("login_tokens").updateOne(
    { _id: row._id },
    { $set: { usedAt: new Date() } },
  );
  const user = await db.collection<UserDocument>("users").findOne({ _id: row.userId });
  if (!user || user.status !== "active") return null;
  await db.collection<UserDocument>("users").updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date() } },
  );
  return { user, locale: row.locale, nextPath: row.nextPath };
}

export function safeNextPath(value: string | undefined, fallback = "/learn/placement") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("://")) return fallback;
  return value;
}

export async function getAuthDb(): Promise<Db | null> {
  return authDb();
}

export function toObjectId(value: string) {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

export function serializeUser(user: UserDocument) {
  return publicUser(user);
}
