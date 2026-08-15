import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Keeps this tab in sync with changes made elsewhere (other tabs/devices).
 * Subscribes to the server's SSE stream and invalidates cached queries when
 * the user's data changes. EventSource reconnects automatically, including
 * after the server caps a connection to free php-fpm workers.
 */
export function useRealtimeSync(enabled: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || typeof EventSource === 'undefined') return

    // Same-origin: cookies (Sanctum session) are sent automatically.
    const es = new EventSource('/api/stream', { withCredentials: true })

    es.addEventListener('sync', () => {
      // Something changed server-side — refetch anything currently on screen.
      queryClient.invalidateQueries()
    })

    return () => es.close()
  }, [enabled, queryClient])
}
