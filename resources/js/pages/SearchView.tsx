import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import PageShell from '../components/PageShell'
import TaskList from '../components/TaskList'
import { useTaskSearch } from '../hooks/queries'

export default function SearchView() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [text, setText] = useState(q)
  const { data, isFetching } = useTaskSearch(q)

  // Debounce the URL (and therefore the query) as the user types.
  useEffect(() => {
    const id = setTimeout(() => {
      setParams(text.trim() ? { q: text.trim() } : {}, { replace: true })
    }, 200)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <PageShell
      title="Search"
      icon={<Search />}
      subtitle={q ? `Results for “${q}”` : 'Find tasks across all projects'}
      quickAdd={
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search tasks by title or note…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      }
    >
      {q.trim() === '' ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Type to search.</p>
      ) : isFetching ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Searching…</p>
      ) : !data?.length ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">No tasks match “{q}”.</p>
      ) : (
        <TaskList tasks={data} reorderable={false} />
      )}
    </PageShell>
  )
}
