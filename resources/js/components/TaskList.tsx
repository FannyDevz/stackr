import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task } from '../lib/types'
import { useReorderTasks } from '../hooks/queries'
import { useDnd } from '../store/dnd'
import { useUI, type TaskFilter } from '../store/ui'
import { matchesFilter } from '../lib/filter'
import TaskRow from './TaskRow'

/** A task is deferred when its start date is still in the future (and not done). */
function isDeferred(t: Task, today: string): boolean {
  return t.status !== 'done' && !!t.defer_date && t.defer_date > today
}

/** Deferred tasks are hidden by default (until their start date), unless the
 * user chooses to show or only-show them. Applied before any other filtering. */
function applyDeferred(tasks: Task[], mode: TaskFilter['deferred']): Task[] {
  if (mode === 'show') return tasks
  const today = format(new Date(), 'yyyy-MM-dd')
  const keep = mode === 'only' ? (t: Task) => isDeferred(t, today) : (t: Task) => !isDeferred(t, today)
  return tasks
    .filter(keep)
    .map((t) => (t.children ? { ...t, children: t.children.filter(keep) } : t))
}

/** A single reorderable group (top-level list, or one parent's subtasks). */
function SortableGroup({ groupId, tasks, indent = false }: { groupId: string; tasks: Task[]; indent?: boolean }) {
  const [order, setOrder] = useState(tasks)
  const reorder = useReorderTasks()
  const registerGroup = useDnd((s) => s.registerGroup)
  const unregisterGroup = useDnd((s) => s.unregisterGroup)

  useEffect(() => setOrder(tasks), [tasks])

  useEffect(() => {
    registerGroup(groupId, {
      tasks: order,
      reorder: (orderedIds) => {
        const byId = new Map(order.map((t) => [t.id, t]))
        const next = orderedIds.map((id) => byId.get(id)).filter(Boolean) as Task[]
        setOrder(next) // optimistic
        reorder.mutate(next.map((t, i) => ({ id: t.id, position: i })))
      },
    })
    return () => unregisterGroup(groupId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, groupId])

  return (
    <SortableContext items={order.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      {order.map((t) => (
        <div key={t.id}>
          <TaskRow task={t} draggable indent={indent} />
          {t.children && t.children.length > 0 && (
            <SortableGroup groupId={`children:${t.id}`} tasks={t.children} indent />
          )}
        </div>
      ))}
    </SortableContext>
  )
}

export default function TaskList({ tasks, reorderable = true }: { tasks: Task[]; reorderable?: boolean }) {
  const filter = useUI((s) => s.taskFilter)

  // Deferred visibility always applies (default = hide upcoming), regardless of
  // the other filters.
  const list = applyDeferred(tasks, filter.deferred)

  // The remaining filters (priority/status/flag/due) → flat matched list, no drag.
  const otherActive =
    filter.priority !== 'all' || filter.status !== 'any' || filter.flagged !== 'any' || filter.due !== 'any'
  if (otherActive) {
    const flat = list.flatMap((t) => [t, ...(t.children ?? [])]).filter((t) => matchesFilter(t, filter))
    if (!flat.length) {
      return <p className="px-4 py-10 text-center text-sm text-slate-400">No tasks match the filter.</p>
    }
    return (
      <div>
        {flat.map((t) => (
          <TaskRow key={t.id} task={t} draggable={false} />
        ))}
      </div>
    )
  }

  if (!list.length) {
    return <p className="px-4 py-10 text-center text-sm text-slate-400">Nothing here yet.</p>
  }

  // Non-reorderable views (Today, Flagged, Tag, Perspective, Completed): flat.
  if (!reorderable) {
    return (
      <div>
        {list.map((t) => (
          <TaskRow key={t.id} task={t} draggable={false} />
        ))}
      </div>
    )
  }

  // Reorderable todolists (Inbox, Project): nested tree with draggable subtasks.
  return (
    <div>
      <SortableGroup groupId="top" tasks={list} />
    </div>
  )
}
