/** Reusable shimmer skeletons for loading states (theme-aware). */

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700/60 ${className}`} />
}

/** Mimics the Markdown editor: a toolbar row + a few text lines. */
export function EditorSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div style={{ height }} className="flex flex-col gap-2.5 p-3">
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
      </div>
      <Skeleton className="mt-1 h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  )
}

export function TaskListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3">
          <Skeleton className="h-4 w-4 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Full-page fallback used while a route chunk loads. */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="mb-3 h-11 w-full rounded-xl" />
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <TaskListSkeleton />
      </div>
    </div>
  )
}
