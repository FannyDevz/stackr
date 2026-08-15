import { CalendarClock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import PageShell from '../components/PageShell'
import TaskList from '../components/TaskList'
import { useForecast } from '../hooks/queries'

function label(key: string) {
  if (key === 'overdue') return 'Overdue'
  const d = parseISO(key)
  return format(d, 'EEEE, MMM d')
}

export default function ForecastView() {
  const { data, isLoading } = useForecast(14)
  const groups = data ?? {}
  const keys = Object.keys(groups).sort((a, b) => (a === 'overdue' ? -1 : b === 'overdue' ? 1 : a.localeCompare(b)))

  return (
    <PageShell title="Forecast" icon={<CalendarClock />} subtitle="Upcoming 14 days">
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : keys.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">No dated tasks ahead.</p>
      ) : (
        keys.map((key) => (
          <div key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                key === 'overdue' ? 'text-red-500' : 'text-slate-400'
              }`}
            >
              {label(key)}
            </div>
            <TaskList tasks={groups[key]} reorderable={false} />
          </div>
        ))
      )}
    </PageShell>
  )
}
