import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useTags } from '../hooks/queries'
import { parseQuickAdd, type ParsedQuickAdd } from '../lib/quickparse'

export default function QuickAdd({
  onAdd,
  placeholder = 'Add a task…',
}: {
  onAdd: (parsed: ParsedQuickAdd) => void
  placeholder?: string
}) {
  const [value, setValue] = useState('')
  const tags = useTags()

  function submit(e: FormEvent) {
    e.preventDefault()
    const parsed = parseQuickAdd(value, tags.data ?? [])
    if (!parsed.title) return
    onAdd(parsed)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2"
    >
      <Plus size={16} className="text-slate-400" />
      <input
        data-quickadd
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        title="Natural language: “Pay bill tomorrow #errands !high”"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </form>
  )
}
