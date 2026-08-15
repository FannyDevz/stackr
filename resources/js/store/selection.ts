import { create } from 'zustand'

interface SelectionState {
  selectMode: boolean
  ids: Set<number>
  setMode: (on: boolean) => void
  toggle: (id: number) => void
  clear: () => void
}

export const useSelection = create<SelectionState>((set) => ({
  selectMode: false,
  ids: new Set(),
  setMode: (on) => set({ selectMode: on, ids: new Set() }),
  toggle: (id) =>
    set((s) => {
      const next = new Set(s.ids)
      next.has(id) ? next.delete(id) : next.add(id)
      return { ids: next }
    }),
  clear: () => set({ selectMode: false, ids: new Set() }),
}))
