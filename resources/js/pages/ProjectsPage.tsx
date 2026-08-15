import { Link } from 'react-router-dom'
import { Flag, FolderKanban } from 'lucide-react'
import PageShell from '../components/PageShell'
import { useProjects } from '../hooks/queries'

export default function ProjectsPage() {
  const { data, isLoading } = useProjects()

  return (
    <PageShell title="All projects" icon={<FolderKanban />}>
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : !data?.length ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">No projects yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((p) => (
            <li key={p.id}>
              <Link to={`/project/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {p.title}
                    {p.flagged && <Flag size={12} className="text-amber-500" />}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">
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
