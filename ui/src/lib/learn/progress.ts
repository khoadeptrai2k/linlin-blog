import type { LearnTrack } from "@/lib/learn/types";

export type StudyAccount = {
  id: string;
  name: string;
};

const ACCOUNT_KEY = "linlin-learn:account";
const LEGACY_ACCOUNT: StudyAccount = { id: "guest", name: "Khach hoc" };

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
}

export function makeAccountId(name: string) {
  const base = slug(name);
  return base || `learner-${Date.now().toString(36)}`;
}

export function readStudyAccount(): StudyAccount {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return LEGACY_ACCOUNT;
    const account = JSON.parse(raw) as Partial<StudyAccount>;
    return {
      id: account.id ? slug(account.id) || LEGACY_ACCOUNT.id : LEGACY_ACCOUNT.id,
      name: account.name?.trim() || account.id || LEGACY_ACCOUNT.name,
    };
  } catch {
    return LEGACY_ACCOUNT;
  }
}

export function saveStudyAccount(account: StudyAccount) {
  const next = {
    id: makeAccountId(account.id || account.name),
    name: account.name.trim() || account.id || LEGACY_ACCOUNT.name,
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("linlin-learn:account-change", { detail: next }));
  return next;
}

export function profileStorageKey(accountId = readStudyAccount().id) {
  return `linlin-learn:${accountId}:profile`;
}

export function doneStorageKey(track: LearnTrack | string, accountId = readStudyAccount().id) {
  return `linlin-learn:${accountId}:${track}`;
}

export function readDone(track: LearnTrack | string, accountId = readStudyAccount().id) {
  try {
    const accountDone = localStorage.getItem(doneStorageKey(track, accountId));
    if (accountDone) return JSON.parse(accountDone) as Record<string, boolean>;
    const legacyDone = localStorage.getItem(`linlin-learn:${track}`);
    return legacyDone ? (JSON.parse(legacyDone) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function markLessonDone(track: LearnTrack | string, id: string) {
  const account = readStudyAccount();
  const next = { ...readDone(track, account.id), [id]: true };
  localStorage.setItem(doneStorageKey(track, account.id), JSON.stringify(next));
}
