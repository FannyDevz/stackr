import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Star, Trash2 } from 'lucide-react'
import PageShell from '../components/PageShell'
import PerspectiveEditor from '../components/PerspectiveEditor'
import TaskList from '../components/TaskList'
import { useDeletePerspective, usePerspectives, usePerspectiveTasks } from '../hooks/queries'

export default function PerspectiveView() {
  const { id } = useParams()
  const perspectiveId = Number(id)
  const { data: tasks, isLoading } = usePerspectiveTasks(perspectiveId)
  const perspectives = usePerspectives()
  const del = useDeletePerspective()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const perspective = perspectives.data?.find((p) => p.id === perspectiveId)

  return (
    <>
      {editing && perspective && (
        <PerspectiveEditor perspective={perspective} onClose={() => setEditing(false)} />
      )}
      <PageShell
        title={perspective?.name ?? 'Perspective'}
        icon={<Star />}
        subtitle="Saved filter"
        filter
        actions={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditing(true)}
              disabled={!perspective}
              className="rounded p-1.5 text-slate-400 hover:text-brand disabled:opacity-40"
              title="Edit perspective"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this perspective?')) {
                  del.mutate(perspectiveId)
                  navigate('/inbox')
                }
              }}
              className="rounded p-1.5 text-slate-400 hover:text-red-500"
              title="Delete perspective"
            >
              <Trash2 size={16} />
            </button>
          </div>
        }
      >
        {isLoading ? (
          <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
        ) : (
          <TaskList tasks={tasks ?? []} reorderable={false} />
        )}
      </PageShell>
    </>
  )
}
