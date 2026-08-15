import type { ReactNode } from 'react'
import { CheckSquare } from 'lucide-react'
import FilterPanel from './FilterPanel'
import FocusActions from './FocusActions'
import { useSelection } from '../store/selection'

export default function PageShell({
  title,
  icon,
  subtitle,
  actions,
  quickAdd,
  filter = false,
  children,
}: {
  title: string
  icon?: ReactNode
  subtitle?: string
  actions?: ReactNode
  quickAdd?: ReactNode
  filter?: boolean
  children: ReactNode
}) {
  const selectMode = useSelection((s) => s.selectMode)
  const setMode = useSelection((s) => s.setMode)

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
      <header className="mb-4 flex items-center gap-3">
        {icon && <span className="text-brand">{icon}</span>}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
        </div>
        <FocusActions />
        {filter && (
          <button
            onClick={() => setMode(!selectMode)}
            className={`rounded-md border px-2 py-1 ${
              selectMode ? 'border-brand text-brand' : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="Select multiple tasks"
          >
            <CheckSquare size={14} />
          </button>
        )}
        {filter && <FilterPanel />}
        {actions}
      </header>
      {quickAdd && <div className="mb-3">{quickAdd}</div>}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  )
}
