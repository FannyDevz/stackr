import { create } from 'zustand'

type Theme = 'light' | 'dark'

export interface TaskFilter {
  priority: 'all' | 'high' | 'medium' | 'low' | 'none'
  status: 'any' | 'todo' | 'done'
  flagged: 'any' | 'yes' | 'no'
  due: 'any' | 'overdue' | 'today' | 'week' | 'hasdate' | 'nodate'
}

export const DEFAULT_FILTER: TaskFilter = { priority: 'all', status: 'any', flagged: 'any', due: 'any' }

export function isFilterActive(f: TaskFilter): boolean {
  return f.priority !== 'all' || f.status !== 'any' || f.flagged !== 'any' || f.due !== 'any'
}

interface UIState {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  selectedTaskId: number | null
  setSelectedTask: (id: number | null) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  taskFilter: TaskFilter
  setTaskFilter: (f: TaskFilter) => void
  helpOpen: boolean
  setHelpOpen: (open: boolean) => void
  remindersEnabled: boolean
  setRemindersEnabled: (on: boolean) => void
  hiddenNav: Record<string, boolean>
  setNavHidden: (key: string, hidden: boolean) => void
}

function applyTheme(t: Theme) {
  const el = document.documentElement
  el.classList.toggle('dark', t === 'dark')
  el.setAttribute('data-color-mode', t)
}

const stored = localStorage.getItem('theme') as Theme | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme: Theme = stored ?? (prefersDark ? 'dark' : 'light')
applyTheme(initialTheme)

function loadFilter(): TaskFilter {
  try {
    return { ...DEFAULT_FILTER, ...JSON.parse(localStorage.getItem('taskFilter') || '{}') }
  } catch {
    return DEFAULT_FILTER
  }
}
const storedFilter = loadFilter()

function loadHiddenNav(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem('hiddenNav') || '{}')
  } catch {
    return {}
  }
}

export const useUI = create<UIState>((set, get) => ({
  theme: initialTheme,
  setTheme: (t) => {
    localStorage.setItem('theme', t)
    applyTheme(t)
    set({ theme: t })
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  selectedTaskId: null,
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  taskFilter: storedFilter,
  setTaskFilter: (f) => {
    localStorage.setItem('taskFilter', JSON.stringify(f))
    set({ taskFilter: f })
  },
  helpOpen: false,
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  remindersEnabled: localStorage.getItem('dueReminders') === '1',
  setRemindersEnabled: (on) => {
    localStorage.setItem('dueReminders', on ? '1' : '0')
    set({ remindersEnabled: on })
  },
  hiddenNav: loadHiddenNav(),
  setNavHidden: (key, hidden) =>
    set((s) => {
      const next = { ...s.hiddenNav, [key]: hidden }
      localStorage.setItem('hiddenNav', JSON.stringify(next))
      return { hiddenNav: next }
    }),
}))
