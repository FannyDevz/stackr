import { create } from 'zustand'
import type { Task } from '../lib/types'

/**
 * Coordinates drag-and-drop across the app. The single DndContext lives in
 * Layout; each visible sortable group (the top-level task list and each parent's
 * subtasks) registers itself here so the global handler can reorder the right
 * group or move a task to a project when dropped on a sidebar zone.
 */
interface Group {
  tasks: Task[]
  reorder: (orderedIds: number[]) => void
}

interface DndState {
  groups: Record<string, Group>
  registerGroup: (id: string, group: Group) => void
  unregisterGroup: (id: string) => void
}

export const useDnd = create<DndState>((set) => ({
  groups: {},
  registerGroup: (id, group) => set((s) => ({ groups: { ...s.groups, [id]: group } })),
  unregisterGroup: (id) =>
    set((s) => {
      const next = { ...s.groups }
      delete next[id]
      return { groups: next }
    }),
}))
