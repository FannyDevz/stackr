import { useEffect, type ReactNode } from 'react'

/**
 * Responsive modal shell: a centered card on desktop, a bottom sheet on mobile.
 * Click-outside and Escape both call onClose.
 */
export default function Modal({
  onClose,
  children,
  className = '',
}: {
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:max-w-sm md:rounded-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
