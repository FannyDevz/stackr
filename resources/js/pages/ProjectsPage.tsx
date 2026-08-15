import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, Flag, FolderKanban } from 'lucide-react'
import PageShell from '../components/PageShell'
import { useProjects } from '../hooks/queries'

export default function ProjectsPage() {
  const [showArchived, setShowArchived] = useState(false)
  const { data, isLoading } = useProjects(showArchived ? { archived: 'only' } : {})

  return (
    <PageShell
      title={showArchived ? 'Archived projects' : 'All projects'}
      icon={<FolderKanban />}
      actions={
        <button
          onClick={() => setShowArchived((v) => !v)}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs ${
            showArchived
              ? 'border-brand text-brand'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand'
          }`}
        >
          <Archive size={14} />
          {showArchived ? 'Show active' : 'Show archived'}
        </button>
      }
    >
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : !data?.length ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">
          {showArchived ? 'No archived projects.' : 'No projects yet.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((p) => (
            <li key={p.id}>
              <Link
                to={`/project/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {p.title}
                    {p.flagged && <Flag size={12} className="text-amber-500" />}
                    {p.archived && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400 dark:bg-slate-800">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="text-xs capitalize text-slate-400">
                    {p.status.replace('_', ' ')} · {p.remaining_count ?? 0} / {p.tasks_count ?? 0} remaining
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
