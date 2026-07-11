import type { LoginRequest, Session } from "../../entities/auth";
import { httpClient } from "../../shared/api/httpClient";
import { clearStoredSession, getStoredSession, storeSession } from "../../shared/lib/sessionStorage";

export async function login(request: LoginRequest) {
  const session = await httpClient<Session>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });

  storeSession(session);
  return session;
}
export { clearStoredSession, getStoredSession, storeSession };
