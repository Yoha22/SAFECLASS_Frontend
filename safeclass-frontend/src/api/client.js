const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ── Token storage ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'safeclass_token';

export const getToken  = ()      => localStorage.getItem(TOKEN_KEY);
export const setToken  = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = ()     => localStorage.removeItem(TOKEN_KEY);

// ── Base fetch wrapper ────────────────────────────────────────────────────────

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── SSE helper ────────────────────────────────────────────────────────────────

/**
 * Opens an EventSource to the alerts stream.
 * Because the browser's EventSource API does not support custom headers,
 * the JWT is passed as a query parameter (?token=...).
 * The backend auth middleware accepts this as a fallback for SSE connections.
 */
export function openAlertsStream(onAlert, onError) {
  const token = getToken();
  const url   = `${BASE_URL}/api/alerts/stream${token ? `?token=${token}` : ''}`;
  const es    = new EventSource(url);

  es.addEventListener('alert', (e) => {
    try {
      onAlert(JSON.parse(e.data));
    } catch {
      // malformed event — ignore
    }
  });

  es.onerror = onError ?? (() => {});
  return es;
}
