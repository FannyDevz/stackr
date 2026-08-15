import { Link } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import FilterPanel from '../components/FilterPanel'
import FocusActions from '../components/FocusActions'
import TaskList, { applyDeferred } from '../components/TaskList'
import { useByProject } from '../hooks/queries'
import { useUI } from '../store/ui'

export default function ByProjectView() {
  const { data, isLoading } = useByProject()
  const deferred = useUI((s) => s.taskFilter.deferred)

  // Only projects that have visible open tasks (respecting the deferred filter);
  // Inbox is intentionally omitted.
  const projects = data?.projects.filter((p) => applyDeferred(p.tasks ?? [], deferred).length > 0) ?? []

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
      <header className="mb-4 flex items-center gap-3">
        <FolderKanban className="text-brand" />
        <h1 className="flex-1 text-lg font-semibold">By project</h1>
        <FocusActions />
        <FilterPanel />
      </header>

      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="space-y-5">
          {/* One group per project (projects with no open tasks are hidden) */}
          {projects.map((p) => (
            <section key={p.id}>
              <div className="mb-1.5 flex items-center gap-2 px-1 text-sm font-semibold">
                <Link to={`/project/${p.id}`} className="hover:text-brand">
                  {p.title}
                </Link>
                <span className="text-xs font-normal text-slate-400">{p.remaining_count ?? 0}</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <TaskList tasks={p.tasks ?? []} reorderable />
              </div>
            </section>
          ))}

          {!projects.length && (
            <p className="px-4 py-10 text-center text-sm text-slate-400">No projects with open tasks.</p>
          )}
        </div>
      )}
    </div>
  )
}
