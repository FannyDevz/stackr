import { X } from 'lucide-react'
import { useToast } from '../store/toast'

export default function Toaster() {
  const toasts = useToast((s) => s.toasts)
  const removeToast = useToast((s) => s.removeToast)

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-xl dark:bg-slate-100 dark:text-slate-900"
        >
          <span>{t.message}</span>
          {t.actionLabel && (
            <button
              onClick={() => {
                t.onAction?.()
                removeToast(t.id)
              }}
              className="font-semibold text-indigo-400 hover:underline dark:text-brand"
            >
              {t.actionLabel}
            </button>
          )}
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white dark:hover:text-slate-900"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
