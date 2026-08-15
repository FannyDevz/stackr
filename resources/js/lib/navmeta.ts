// Single source of truth for sidebar item labels + detailed descriptions.
// Used both for the sidebar tooltips and the Settings "Sidebar" toggle list.

export type NavKey =
  | 'search'
  | 'inbox'
  | 'today'
  | 'forecast'
  | 'calendar'
  | 'flagged'
  | 'review'
  | 'completed'
  | 'allProjects'
  | 'byProject'
  | 'tags'
  | 'perspectives'

export const NAV_META: Record<NavKey, { label: string; desc: string }> = {
  search: {
    label: 'Search',
    desc: 'Find any task, project, or tag by keyword across everything you have.',
  },
  inbox: {
    label: 'Inbox',
    desc: 'Unfiled tasks with no project yet — your quick capture point. Process them into projects later.',
  },
  today: {
    label: 'Today',
    desc: 'Tasks due today or already overdue, plus anything flagged — your daily focus list.',
  },
  forecast: {
    label: 'Forecast',
    desc: 'Upcoming tasks laid out day by day so you can see what is coming next.',
  },
  calendar: {
    label: 'Calendar',
    desc: 'A monthly grid showing tasks on their due dates.',
  },
  flagged: {
    label: 'Flagged',
    desc: 'Every task you marked important with a flag, gathered from all projects.',
  },
  review: {
    label: 'Review',
    desc: 'Projects whose review date has arrived — step through them to keep your projects current.',
  },
  completed: {
    label: 'Completed',
    desc: 'Tasks you have finished, most recently completed first.',
  },
  allProjects: {
    label: 'All projects',
    desc: 'The full list of your projects with their status and remaining count.',
  },
  byProject: {
    label: 'By project',
    desc: 'All of your tasks grouped under their project in one scrollable overview.',
  },
  tags: {
    label: 'Tags',
    desc: 'Context labels like @home or @errand. Filter tasks by where, how, or with what you do them.',
  },
  perspectives: {
    label: 'Perspectives',
    desc: 'Your own saved views — combine filters (flagged, due, tag…) into a custom list.',
  },
}

// Items that can be shown/hidden from the Settings page.
export const NAV_TOGGLE_KEYS: NavKey[] = [
  'calendar',
  'flagged',
  'review',
  'allProjects',
  'byProject',
  'tags',
  'perspectives',
]
