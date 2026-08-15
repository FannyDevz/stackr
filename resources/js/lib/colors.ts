export const TASK_COLORS = ['red', 'orange', 'amber', 'green', 'teal', 'sky', 'blue', 'violet', 'pink'] as const

export type TaskColor = (typeof TASK_COLORS)[number]

export const COLOR_DOT: Record<TaskColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  teal: 'bg-teal-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
}

export function colorClass(color: string | null | undefined): string | null {
  return color && color in COLOR_DOT ? COLOR_DOT[color as TaskColor] : null
}
