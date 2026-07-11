import { getStoredSession } from "../lib/sessionStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function httpClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getStoredSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init.headers,
    },
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T> | T) : null;

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.message === "string" ? payload.message : `HTTP ${response.status}`;
    throw new Error(message);
  }

  if (isRecord(payload) && "success" in payload) {
    const apiPayload = payload as ApiResponse<T>;
    if (!payload.success) {
      throw new Error(apiPayload.message ?? "No se pudo completar la solicitud.");
    }

    return apiPayload.data;
  }

  return payload as T;
}
