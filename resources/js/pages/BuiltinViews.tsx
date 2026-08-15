import { format } from 'date-fns'
import { Flag, Inbox, Star } from 'lucide-react'
import PageShell from '../components/PageShell'
import QuickAdd from '../components/QuickAdd'
import TaskList from '../components/TaskList'
import { useCreateTask, useView } from '../hooks/queries'

function Loading() {
  return <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
}

export function InboxView() {
  const q = useView('inbox')
  const create = useCreateTask()
  return (
    <PageShell
      title="Inbox"
      icon={<Inbox />}
      subtitle="Unfiled tasks"
      filter
      quickAdd={<QuickAdd onAdd={(p) => create.mutate(p)} />}
    >
      {q.isLoading ? <Loading /> : <TaskList tasks={q.data ?? []} reorderable />}
    </PageShell>
  )
}

export function TodayView() {
  const q = useView('today')
  const create = useCreateTask()
  const today = format(new Date(), 'yyyy-MM-dd')
  return (
    <PageShell
      title="Today"
      icon={<Star />}
      subtitle="Due today, overdue, or flagged"
      filter
      quickAdd={
        <QuickAdd onAdd={(p) => create.mutate({ ...p, due_date: p.due_date ?? today })} placeholder="Add a task due today…" />
      }
    >
      {q.isLoading ? <Loading /> : <TaskList tasks={q.data ?? []} reorderable={false} />}
    </PageShell>
  )
}

export function FlaggedView() {
  const q = useView('flagged')
  const create = useCreateTask()
  return (
    <PageShell
      title="Flagged"
      icon={<Flag />}
      subtitle="Everything you've starred"
      filter
      quickAdd={<QuickAdd onAdd={(p) => create.mutate({ ...p, flagged: true })} placeholder="Add a flagged task…" />}
    >
      {q.isLoading ? <Loading /> : <TaskList tasks={q.data ?? []} reorderable={false} />}
    </PageShell>
  )
}
