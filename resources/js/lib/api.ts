import axios from 'axios'

// Same-origin: the SPA is served by Laravel, so relative URLs need no CORS.
const API_URL = import.meta.env.VITE_API_URL ?? ''

/** Talks to the Laravel REST API under /api with Sanctum SPA cookies. */
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

/** Root client for the CSRF-cookie endpoint (outside /api). */
const root = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true,
})

let csrfReady = false

/** Fetch the XSRF-TOKEN cookie once before the first mutating request. */
export async function ensureCsrf(): Promise<void> {
  if (!csrfReady) {
    await root.get('/sanctum/csrf-cookie')
    csrfReady = true
  }
}

/** Unwrap Laravel API Resource envelopes ({ data: ... }). */
export function unwrap<T>(payload: { data: T } | T): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}
