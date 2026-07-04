import type { ApiResponse } from './types';

// Si VITE_API_URL esta vacio se usan rutas relativas (/api/...) y el proxy de
// Vite reenvia al backend. Si se define, se hacen peticiones directas.
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const TOKEN_KEY = 'autogest.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: string[] | null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = `${BASE_URL}${path}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Realiza una peticion a la API y devuelve el envelope ApiResponse<T>.
 * Lanza ApiError cuando la respuesta HTTP no es exitosa.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, query, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await response.text();
  let payload: ApiResponse<T> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = payload?.message ?? `Error ${response.status}`;
    throw new ApiError(response.status, message, payload?.errors);
  }

  if (!payload) {
    // Respuesta vacia pero exitosa (ej. 204).
    return { success: true, message: '', data: null };
  }

  return payload;
}
