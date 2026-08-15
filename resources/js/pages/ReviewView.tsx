import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import PageShell from '../components/PageShell'
import { useReviewProject, useReviewProjects } from '../hooks/queries'

export default function ReviewView() {
  const { data, isLoading } = useReviewProjects()
  const review = useReviewProject()

  return (
    <PageShell title="Review" icon={<RefreshCw />} subtitle="Projects due for review">
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : !data?.length ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Nothing to review. Nice work! 🎉</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link to={`/project/${p.id}`} className="text-sm font-medium hover:text-brand">
                  {p.title}
                </Link>
                <div className="text-xs text-slate-400">
                  {p.remaining_count ?? 0} remaining ·{' '}
                  {p.last_reviewed_at
                    ? `reviewed ${formatDistanceToNow(parseISO(p.last_reviewed_at))} ago`
                    : 'never reviewed'}
                </div>
              </div>
              <button
                onClick={() => review.mutate(p.id)}
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                Mark reviewed
              </button>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
