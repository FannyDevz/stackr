export type Priority = 'none' | 'low' | 'medium' | 'high'

export const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high']

export const PRIORITY_META: Record<Priority, { label: string; dot: string; text: string }> = {
  none: { label: 'None', dot: 'bg-slate-300 dark:bg-slate-600', text: 'text-slate-400' },
  low: { label: 'Low', dot: 'bg-sky-400', text: 'text-sky-500' },
  medium: { label: 'Medium', dot: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400' },
  high: { label: 'High', dot: 'bg-red-500', text: 'text-red-500' },
}
