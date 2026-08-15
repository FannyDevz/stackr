import { addDays, format } from 'date-fns'
import type { Task } from './types'
import type { TaskFilter } from '../store/ui'

/** Client-side predicate for the custom task filter. */
export function matchesFilter(t: Task, f: TaskFilter): boolean {
  if (f.priority !== 'all' && t.priority !== f.priority) return false
  if (f.status === 'todo' && t.status !== 'todo') return false
  if (f.status === 'done' && t.status !== 'done') return false
  if (f.flagged === 'yes' && !t.flagged) return false
  if (f.flagged === 'no' && t.flagged) return false

  if (f.due !== 'any') {
    const today = format(new Date(), 'yyyy-MM-dd')
    const weekEnd = format(addDays(new Date(), 7), 'yyyy-MM-dd')
    const d = t.due_date
    switch (f.due) {
      case 'overdue':
        if (!(d && d < today)) return false
        break
      case 'today':
        if (d !== today) return false
        break
      case 'week':
        if (!(d && d <= weekEnd)) return false
        break
      case 'hasdate':
        if (!d) return false
        break
      case 'nodate':
        if (d) return false
        break
    }
  }
  return true
}
