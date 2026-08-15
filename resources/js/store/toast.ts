import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface ToastState {
  toasts: Toast[]
  addToast: (t: Omit<Toast, 'id'>, duration?: number) => void
  removeToast: (id: number) => void
}

let counter = 0

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (t, duration = 5000) => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    window.setTimeout(() => get().removeToast(id), duration)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))
