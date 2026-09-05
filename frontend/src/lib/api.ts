export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';
const TOKEN_KEY = 'concert.accessToken';


interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  errors?: { field: string; message: string }[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  static fromResponse(status: number, body: ApiErrorBody | null): ApiError {
    const fieldErrors: Record<string, string> = {};
    for (const item of body?.errors ?? []) {
      if (!fieldErrors[item.field]) fieldErrors[item.field] = item.message;
    }
    const raw = body?.message;
    let message = Array.isArray(raw) ? raw.join(', ') : raw ?? `Request failed (${status})`;
    if (message === 'Validation failed' && Object.keys(fieldErrors).length > 0) {
      message = Object.values(fieldErrors).join(' · ');
    }
    return new ApiError(status, message, fieldErrors);
  }
}

export const tokenStore = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode) – session simply won't persist */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const AUTH_EXPIRED_EVENT = 'concert:auth-expired';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  skipAuthReset?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token === undefined ? tokenStore.get() : options.token;
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again in a moment.');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token && !options.skipAuthReset) {
      tokenStore.clear();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw ApiError.fromResponse(response.status, data as ApiErrorBody | null);
  }
  return data as T;
}
