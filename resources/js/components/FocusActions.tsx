import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Inbox, Tag } from 'lucide-react'
import { useUI } from '../store/ui'
import { useTask } from '../hooks/queries'

/**
 * "Focus" shortcuts shown in the main list header once a task is selected:
 * jump to the selected task's project or one of its tags.
 */
export default function FocusActions() {
  const selectedTaskId = useUI((s) => s.selectedTaskId)
  const setSelectedTask = useUI((s) => s.setSelectedTask)
  const navigate = useNavigate()
  const { data: task } = useTask(selectedTaskId)
  const [tagMenu, setTagMenu] = useState(false)

  if (!selectedTaskId || !task) return null

  const tags = task.tags ?? []
  const hasProject = task.project_id != null

  function focus(path: string) {
    navigate(path)
    setSelectedTask(null)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => focus(hasProject ? `/project/${task.project_id}` : '/inbox')}
        className="rounded p-1.5 text-slate-400 hover:text-brand"
        title={hasProject ? 'Focus project' : 'Focus Inbox'}
      >
        {hasProject ? <FolderKanban size={16} /> : <Inbox size={16} />}
      </button>
      {tags.length > 0 && (
        <div className="relative">
          <button
            onClick={() => (tags.length === 1 ? focus(`/tag/${tags[0].id}`) : setTagMenu((v) => !v))}
            className="rounded p-1.5 text-slate-400 hover:text-brand"
            title="Focus tag"
          >
            <Tag size={16} />
          </button>
          {tagMenu && tags.length > 1 && (
            <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-lg">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => focus(`/tag/${t.id}`)}
                  className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
