import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Tag as TagIcon, Trash2 } from 'lucide-react'
import PageShell from '../components/PageShell'
import QuickAdd from '../components/QuickAdd'
import TaskList from '../components/TaskList'
import { useCreateTask, useDeleteTag, useTags, useTasks, useUpdateTag } from '../hooks/queries'
import { COLOR_DOT, TASK_COLORS } from '../lib/colors'
import { showConfirm, showPrompt } from '../store/dialog'

export default function TagView() {
  const { id } = useParams()
  const tagId = Number(id)
  const { data: tasks, isLoading } = useTasks({ tag_id: tagId, availability: 'remaining' })
  const tags = useTags()
  const create = useCreateTask()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()
  const navigate = useNavigate()
  const tag = tags.data?.find((t) => t.id === tagId)

  return (
    <PageShell
      title={tag?.name ?? 'Tag'}
      icon={<TagIcon />}
      subtitle="Tasks with this tag"
      filter
      actions={
        tag && (
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={async () => {
                const name = await showPrompt({
                  title: 'Rename tag',
                  label: 'Tag name',
                  defaultValue: tag.name,
                  confirmText: 'Rename',
                })
                if (name && name !== tag.name) updateTag.mutate({ id: tag.id, name })
              }}
              className="rounded p-1.5 text-slate-400 hover:text-brand"
              title="Rename tag"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={async () => {
                if (
                  await showConfirm({
                    title: `Delete tag “${tag.name}”?`,
                    message: 'The tag is removed from all tasks. The tasks themselves are kept.',
                    confirmText: 'Delete',
                    danger: true,
                  })
                ) {
                  deleteTag.mutate(tag.id)
                  navigate('/inbox')
                }
              }}
              className="rounded p-1.5 text-slate-400 hover:text-red-500"
              title="Delete tag"
            >
              <Trash2 size={16} />
            </button>
            <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={() => updateTag.mutate({ id: tag.id, color: null })}
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] text-slate-400 ${
                !tag.color ? 'border-brand ring-1 ring-brand' : 'border-slate-300 dark:border-slate-600'
              }`}
              title="No color"
            >
              ✕
            </button>
            {TASK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateTag.mutate({ id: tag.id, color: c })}
                className={`h-5 w-5 rounded-full ${COLOR_DOT[c]} ${
                  tag.color === c ? 'ring-2 ring-slate-400 ring-offset-1 dark:ring-offset-slate-950' : ''
                }`}
                title={c}
              />
            ))}
          </div>
        )
      }
      quickAdd={<QuickAdd onAdd={(p) => create.mutate({ ...p, tag_ids: [tagId, ...(p.tag_ids ?? [])] })} />}
    >
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : (
        <TaskList tasks={tasks ?? []} reorderable={false} />
      )}
    </PageShell>
  )
}
