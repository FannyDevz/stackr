import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDroppable } from '@dnd-kit/core'
import {
  CalendarClock,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Flag,
  Folder,
  FolderPlus,
  Inbox,
  Keyboard,
  LayoutTemplate,
  List,
  LogOut,
  Moon,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  Sun,
  Tag as TagIcon,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useUI } from '../store/ui'
import {
  useCounts,
  useCreateFolder,
  useCreateProject,
  useCreateTag,
  useFolders,
  usePerspectives,
  useProjects,
  useTags,
} from '../hooks/queries'
import type { Project } from '../lib/types'
import PerspectiveEditor from './PerspectiveEditor'
import TemplatesModal from './TemplatesModal'
import Logo from './Logo'
import { colorClass } from '../lib/colors'
import { NAV_META } from '../lib/navmeta'
import { showPrompt } from '../store/dialog'

const navItemCls =
  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
const activeCls = 'bg-brand/10 !text-brand font-medium'
const menuItemCls =
  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useUI()
  const setHelpOpen = useUI((s) => s.setHelpOpen)
  const hidden = useUI((s) => s.hiddenNav)
  const navigate = useNavigate()

  const projects = useProjects({ status: 'active' })
  const folders = useFolders()
  const tags = useTags()
  const perspectives = usePerspectives()
  const counts = useCounts().data
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  function toggleFolder(id: number) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function renderProject(p: Project) {
    return (
      <DropZone key={p.id} id={`zone:${p.id}`}>
        <NavLink to={`/project/${p.id}`} className={link} title={p.title}>
          <span className="truncate">{p.title}</span>
          {p.flagged && <Flag size={12} className="ml-auto text-amber-500" />}
          {!!p.remaining_count && <span className="ml-auto text-xs text-slate-400">{p.remaining_count}</span>}
        </NavLink>
      </DropZone>
    )
  }

  const createProject = useCreateProject()
  const createFolder = useCreateFolder()
  const createTag = useCreateTag()
  const [perspEditorOpen, setPerspEditorOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function link({ isActive }: { isActive: boolean }) {
    return `${navItemCls} ${isActive ? activeCls : ''}`
  }

  return (
    <aside
      className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) onNavigate?.()
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <Logo size={22} />
        <span className="font-semibold">Stackr</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
        <div className="space-y-0.5">
          <NavLink to="/search" className={link} title={NAV_META.search.desc}>
            <Search size={16} /> Search
          </NavLink>
          <DropZone id="zone:inbox">
            <NavLink to="/inbox" className={link} title={NAV_META.inbox.desc}>
              <Inbox size={16} /> Inbox
              <NavBadge n={counts?.inbox} />
            </NavLink>
          </DropZone>
          <NavLink to="/today" className={link} title={NAV_META.today.desc}>
            <Star size={16} /> Today
            <NavBadge n={counts?.today} danger={!!counts?.overdue} />
          </NavLink>
          <NavLink to="/forecast" className={link} title={NAV_META.forecast.desc}>
            <CalendarClock size={16} /> Forecast
          </NavLink>
          {!hidden.calendar && (
            <NavLink to="/calendar" className={link} title={NAV_META.calendar.desc}>
              <CalendarDays size={16} /> Calendar
            </NavLink>
          )}
          {!hidden.flagged && (
            <NavLink to="/flagged" className={link} title={NAV_META.flagged.desc}>
              <Flag size={16} /> Flagged
              <NavBadge n={counts?.flagged} />
            </NavLink>
          )}
          {!hidden.review && (
            <NavLink to="/review" className={link} title={NAV_META.review.desc}>
              <RefreshCw size={16} /> Review
              <NavBadge n={counts?.review} />
            </NavLink>
          )}
          <NavLink to="/completed" className={link} title={NAV_META.completed.desc}>
            <CheckCheck size={16} /> Completed
          </NavLink>
        </div>

        <Section
          title="Projects"
          onAdd={async () => {
            const title = await showPrompt({ title: 'New project', label: 'Project name', confirmText: 'Create' })
            if (title) createProject.mutate({ title })
          }}
          extra={
            <>
              {!hidden.allProjects && (
                <NavLink
                  to="/projects"
                  title={NAV_META.allProjects.desc}
                  className={({ isActive }) => `text-slate-400 hover:text-brand ${isActive ? '!text-brand' : ''}`}
                >
                  <List size={14} />
                </NavLink>
              )}
              <button
                title="Project templates"
                onClick={() => setTemplatesOpen(true)}
                className="text-slate-400 hover:text-brand"
              >
                <LayoutTemplate size={14} />
              </button>
              <button
                title="New folder"
                onClick={async () => {
                  const name = await showPrompt({ title: 'New folder', label: 'Folder name', confirmText: 'Create' })
                  if (name) createFolder.mutate(name)
                }}
                className="text-slate-400 hover:text-brand"
              >
                <FolderPlus size={14} />
              </button>
            </>
          }
        >
          {!hidden.byProject && (
            <NavLink to="/by-project" className={link} title={NAV_META.byProject.desc}>
              <span className="text-slate-400">By project</span>
            </NavLink>
          )}
          {projects.data?.filter((p) => p.folder_id == null).map(renderProject)}
          {folders.data?.map((folder) => {
            const inFolder = projects.data?.filter((p) => p.folder_id === folder.id) ?? []
            const isCollapsed = collapsed.has(folder.id)
            return (
              <div key={folder.id}>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="rounded p-1 text-slate-400 hover:text-brand"
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </button>
                  <NavLink to={`/folder/${folder.id}`} className={(s) => `${link(s)} min-w-0 flex-1`} title={folder.name}>
                    <Folder size={13} /> <span className="truncate">{folder.name}</span>
                    {!!inFolder.length && <span className="ml-auto text-[10px] text-slate-400">{inFolder.length}</span>}
                  </NavLink>
                </div>
                {!isCollapsed && <div className="ml-2 space-y-0.5">{inFolder.map(renderProject)}</div>}
              </div>
            )
          })}
        </Section>

        {!hidden.tags && (
        <Section
          title="Tags"
          titleHint={NAV_META.tags.desc}
          onAdd={async () => {
            const name = await showPrompt({ title: 'New tag', label: 'Tag name', confirmText: 'Create' })
            if (name) createTag.mutate(name)
          }}
        >
          {tags.data?.map((t) => (
            <NavLink key={t.id} to={`/tag/${t.id}`} className={link} title={t.name}>
              {colorClass(t.color) ? (
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorClass(t.color)}`} />
              ) : (
                <TagIcon size={14} />
              )}{' '}
              <span className="truncate">{t.name}</span>
              {!!t.tasks_count && <span className="ml-auto text-xs text-slate-400">{t.tasks_count}</span>}
            </NavLink>
          ))}
        </Section>
        )}

        {!hidden.perspectives && (
        <Section title="Perspectives" titleHint={NAV_META.perspectives.desc} onAdd={() => setPerspEditorOpen(true)}>
          {perspectives.data?.map((p) => (
            <NavLink key={p.id} to={`/perspective/${p.id}`} className={link} title={p.name}>
              <Star size={14} /> <span className="truncate">{p.name}</span>
            </NavLink>
          ))}
        </Section>
        )}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-xs font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user?.name}</div>
            <div className="truncate text-xs text-slate-400">{user?.email}</div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded p-1.5 text-slate-400 hover:text-brand"
              title="Menu"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-2 w-44 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 text-sm shadow-lg">
                  <button
                    onClick={() => {
                      setHelpOpen(true)
                      setMenuOpen(false)
                    }}
                    className={menuItemCls}
                  >
                    <Keyboard size={14} /> Keyboard shortcuts
                  </button>
                  <button onClick={() => toggleTheme()} className={menuItemCls}>
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      onNavigate?.()
                      setMenuOpen(false)
                    }}
                    className={menuItemCls}
                  >
                    <Settings size={14} /> Settings
                  </button>
                  <button onClick={() => logout()} className={`${menuItemCls} text-red-500`}>
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {perspEditorOpen && <PerspectiveEditor onClose={() => setPerspEditorOpen(false)} />}
      {templatesOpen && <TemplatesModal onClose={() => setTemplatesOpen(false)} />}
    </aside>
  )
}

function NavBadge({ n, danger = false }: { n?: number; danger?: boolean }) {
  if (!n) return null
  return (
    <span
      className={`ml-auto rounded-full px-1.5 text-xs tabular-nums ${
        danger ? 'bg-red-500 text-white' : 'text-slate-400'
      }`}
    >
      {n}
    </span>
  )
}

function DropZone({ id, children }: { id: string; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg transition-colors ${
        isOver ? 'bg-brand/15 ring-1 ring-inset ring-brand' : ''
      }`}
    >
      {children}
    </div>
  )
}

function Section({
  title,
  titleHint,
  onAdd,
  extra,
  children,
}: {
  title: string
  titleHint?: string
  onAdd: () => void
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 py-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400" title={titleHint}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          {extra}
          <button onClick={onAdd} className="text-slate-400 hover:text-brand" title={`Add ${title}`}>
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
