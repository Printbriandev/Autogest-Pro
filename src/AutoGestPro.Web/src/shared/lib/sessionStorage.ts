import type { Session } from "../../entities/auth";

const SESSION_KEY = "autogest.session";

export function getStoredSession(): Session | null {
  const rawSession = window.localStorage.getItem(SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as Session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function storeSession(session: Session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
