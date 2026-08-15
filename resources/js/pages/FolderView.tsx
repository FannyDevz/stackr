import { Link, useNavigate, useParams } from 'react-router-dom'
import { Flag, Folder, Pencil, Trash2 } from 'lucide-react'
import PageShell from '../components/PageShell'
import { useDeleteFolder, useFolders, useProjects, useUpdateFolder } from '../hooks/queries'

export default function FolderView() {
  const { id } = useParams()
  const folderId = Number(id)
  const folders = useFolders()
  const folder = folders.data?.find((f) => f.id === folderId)
  const { data: projects, isLoading } = useProjects({ folder_id: folderId })
  const update = useUpdateFolder()
  const del = useDeleteFolder()
  const navigate = useNavigate()

  return (
    <PageShell
      title={folder?.name ?? 'Folder'}
      icon={<Folder />}
      subtitle="Projects in this folder"
      actions={
        folder && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const name = prompt('Rename folder', folder.name)
                if (name && name.trim() && name !== folder.name) update.mutate({ id: folder.id, name: name.trim() })
              }}
              className="rounded p-1.5 text-slate-400 hover:text-brand"
              title="Rename folder"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete folder “${folder.name}”? Its projects are kept and moved out of the folder.`)) {
                  del.mutate(folder.id)
                  navigate('/projects')
                }
              }}
              className="rounded p-1.5 text-slate-400 hover:text-red-500"
              title="Delete folder"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      }
    >
      {isLoading ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
      ) : !projects?.length ? (
        <p className="px-4 py-10 text-center text-sm text-slate-400">No projects in this folder yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                to={`/project/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {p.title}
                    {p.flagged && <Flag size={12} className="text-amber-500" />}
                  </div>
                  <div className="text-xs capitalize text-slate-400">
                    {p.status.replace('_', ' ')} · {p.remaining_count ?? 0} remaining
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
