import { api, ensureCsrf } from './api'

// Browser push subscription helpers. Requires a registered service worker
// (only registered in production builds — DDEV serves the prod build).

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/** VAPID keys arrive as URL-safe base64; the PushManager needs a Uint8Array. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

/** Is this browser already subscribed for push on this site? */
export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return false
  const sub = await reg.pushManager.getSubscription()
  return !!sub
}

/**
 * Ask permission, create a PushManager subscription with the server's VAPID
 * key, and register it with the API. Throws with a readable message on failure.
 */
export async function subscribeToPush(): Promise<void> {
  if (!isPushSupported()) throw new Error('Push is not supported in this browser.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Notification permission was denied.')

  const reg = await navigator.serviceWorker.ready

  const { data } = await api.get<{ key: string }>('/push/key')
  if (!data.key) throw new Error('Server is missing its VAPID key.')

  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.key) as BufferSource,
    })
  }

  const json = sub.toJSON()
  const encoding =
    (PushManager as unknown as { supportedContentEncodings?: string[] }).supportedContentEncodings?.[0] ??
    'aes128gcm'

  await ensureCsrf()
  await api.post('/push/subscribe', {
    endpoint: json.endpoint,
    keys: json.keys,
    contentEncoding: encoding,
  })
}

/** Remove the browser subscription and tell the API to forget it. */
export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return

  const endpoint = sub.endpoint
  await sub.unsubscribe().catch(() => {})
  await ensureCsrf()
  await api.post('/push/unsubscribe', { endpoint }).catch(() => {})
}
