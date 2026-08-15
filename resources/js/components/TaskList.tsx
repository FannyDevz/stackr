import { useEffect, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task } from '../lib/types'
import { useReorderTasks } from '../hooks/queries'
import { useDnd } from '../store/dnd'
import { isFilterActive, useUI } from '../store/ui'
import { matchesFilter } from '../lib/filter'
import TaskRow from './TaskRow'

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

  // Any active filter → flat list (parents + subtasks) matching the rules; no drag.
  if (isFilterActive(filter)) {
    const flat = tasks.flatMap((t) => [t, ...(t.children ?? [])]).filter((t) => matchesFilter(t, filter))
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

  if (!tasks.length) {
    return <p className="px-4 py-10 text-center text-sm text-slate-400">Nothing here yet.</p>
  }

  // Non-reorderable views (Today, Flagged, Tag, Perspective, Completed): flat.
  if (!reorderable) {
    return (
      <div>
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} draggable={false} />
        ))}
      </div>
    )
  }

  // Reorderable todolists (Inbox, Project): nested tree with draggable subtasks.
  return (
    <div>
      <SortableGroup groupId="top" tasks={tasks} />
    </div>
  )
}
