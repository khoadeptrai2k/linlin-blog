export const AI_ASSIST_KEY = "linlin-ai-assist";

const listeners = new Set<() => void>();
let cache: boolean | null = null;

function read() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AI_ASSIST_KEY) === "on";
  } catch {
    return false;
  }
}

export function getAiAssist() {
  if (typeof window === "undefined") return false;
  if (cache === null) cache = read();
  return cache;
}

export function getAiAssistServer() {
  return false;
}

export function setAiAssist(on: boolean) {
  cache = on;
  localStorage.setItem(AI_ASSIST_KEY, on ? "on" : "off");
  listeners.forEach((listen) => listen());
}

export function subscribeAiAssist(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}
