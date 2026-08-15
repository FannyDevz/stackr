import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react'
import Modal from './Modal'
import { useArchiveProject, useDeleteProject, useFolders, useUpdateProject } from '../hooks/queries'
import { showConfirm } from '../store/dialog'
import type { Project, ProjectStatus, ProjectType } from '../lib/types'

const TYPES: { v: ProjectType; label: string }[] = [
  { v: 'parallel', label: 'Parallel' },
  { v: 'sequential', label: 'Sequential' },
  { v: 'single_actions', label: 'Single actions' },
]
const STATUSES: { v: ProjectStatus; label: string }[] = [
  { v: 'active', label: 'Active' },
  { v: 'on_hold', label: 'On hold' },
  { v: 'done', label: 'Done' },
  { v: 'dropped', label: 'Dropped' },
]

export default function ProjectEditModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const folders = useFolders()
  const update = useUpdateProject()
  const del = useDeleteProject()
  const archive = useArchiveProject()
  const navigate = useNavigate()

  const [title, setTitle] = useState(project.title)
  const [folderId, setFolderId] = useState<number | ''>(project.folder_id ?? '')
  const [type, setType] = useState<ProjectType>(project.type)
  const [status, setStatus] = useState<ProjectStatus>(project.status)
  const [review, setReview] = useState(project.review_interval_days?.toString() ?? '')

  function save() {
    update.mutate({
      id: project.id,
      title: title.trim() || project.title,
      folder_id: folderId === '' ? null : Number(folderId),
      type,
      status,
      review_interval_days: review ? Number(review) : null,
    })
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[85vh] overflow-y-auto p-5">
        <h2 className="mb-4 text-base font-semibold">Edit project</h2>

        <div className="space-y-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inp} autoFocus />
          </Field>
          <Field label="Folder">
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : '')}
              className={inp}
            >
              <option value="">No folder</option>
              {folders.data?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value as ProjectType)} className={inp}>
                {TYPES.map((t) => (
                  <option key={t.v} value={t.v}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={inp}>
                {STATUSES.map((s) => (
                  <option key={s.v} value={s.v}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Review every (days)">
            <input
              type="number"
              min={1}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Never"
              className={inp}
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={() => {
              archive.mutate({ id: project.id, archived: !project.archived })
              onClose()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
          >
            {project.archived ? (
              <>
                <ArchiveRestore size={14} /> Unarchive
              </>
            ) : (
              <>
                <Archive size={14} /> Archive
              </>
            )}
          </button>
          <button
            onClick={async () => {
              if (
                await showConfirm({
                  title: `Delete “${project.title}”?`,
                  message: 'The project and its tasks will be removed.',
                  confirmText: 'Delete',
                  danger: true,
                })
              ) {
                del.mutate(project.id)
                onClose()
                navigate('/projects')
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={14} /> Delete
          </button>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Cancel
            </button>
            <button onClick={save} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const inp =
  'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
      {children}
    </div>
  )
}
