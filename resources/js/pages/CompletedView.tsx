import { CheckCheck } from 'lucide-react'
import PageShell from '../components/PageShell'
import TaskList from '../components/TaskList'
import { useView } from '../hooks/queries'

export default function CompletedView() {
  const { data, isLoading } = useView('completed')

  return (
    <PageShell title="Completed" icon={<CheckCheck />} subtitle="Recently finished tasks">
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : (
        <TaskList tasks={data ?? []} reorderable={false} />
      )}
    </PageShell>
  )
}
