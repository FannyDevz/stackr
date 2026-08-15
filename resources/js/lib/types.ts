export interface User {
  id: number
  name: string
  email: string
  settings: Record<string, unknown>
  created_at: string
}

export interface Tag {
  id: number
  parent_id: number | null
  name: string
  color: string | null
  position: number
  tasks_count?: number
}

export interface Comment {
  id: number
  task_id: number
  body: string
  created_at: string
  updated_at: string
}

export type TaskStatus = 'todo' | 'done' | 'dropped'

export interface Task {
  id: number
  project_id: number | null
  parent_id: number | null
  title: string
  note: string | null
  status: TaskStatus
  completed_at: string | null
  defer_date: string | null
  due_date: string | null
  flagged: boolean
  priority: 'none' | 'low' | 'medium' | 'high'
  color: string | null
  estimated_minutes: number | null
  repeat_rule: unknown
  position: number
  tags?: Tag[]
  children?: Task[]
  comments?: Comment[]
  children_count?: number
  project?: Project
  created_at: string
  updated_at: string
}

export type ProjectType = 'sequential' | 'parallel' | 'single_actions'
export type ProjectStatus = 'active' | 'on_hold' | 'done' | 'dropped'

export interface Project {
  id: number
  folder_id: number | null
  title: string
  note: string | null
  type: ProjectType
  status: ProjectStatus
  defer_date: string | null
  due_date: string | null
  flagged: boolean
  review_interval_days: number | null
  last_reviewed_at: string | null
  next_review_at: string | null
  completed_at: string | null
  position: number
  tasks_count?: number
  remaining_count?: number
  tasks?: Task[]
  created_at: string
  updated_at: string
}

export interface Folder {
  id: number
  name: string
  position: number
  projects_count?: number
}

export interface Perspective {
  id: number
  name: string
  icon: string | null
  filter_rules: Record<string, unknown>
  sort_rule: string | null
  position: number
}

export interface ForecastGroups {
  [key: string]: Task[]
}

export interface Counts {
  inbox: number
  today: number
  overdue: number
  flagged: number
  review: number
}
