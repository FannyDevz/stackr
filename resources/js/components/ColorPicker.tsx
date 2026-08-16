import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { COLOR_DOT, TASK_COLORS, colorClass } from '../lib/colors'

/** Compact color picker: a single swatch that opens a popover grid. */
export default function ColorPicker({
  value,
  onChange,
  title = 'Color',
}: {
  value: string | null | undefined
  onChange: (color: string | null) => void
  title?: string
}) {
  const [open, setOpen] = useState(false)
  const cls = colorClass(value)

  function pick(c: string | null) {
    onChange(c)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title={title}
        className="flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-1 text-slate-400 hover:border-brand dark:border-slate-700"
      >
        {cls ? (
          <span className={`h-4 w-4 rounded-full ${cls}`} />
        ) : (
          <span className="h-4 w-4 rounded-full border border-dashed border-slate-400" />
        )}
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-max rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="grid grid-cols-5 gap-1.5">
              <button
                onClick={() => pick(null)}
                title="No color"
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] text-slate-400 ${
                  !value ? 'border-brand ring-2 ring-brand' : 'border-dashed border-slate-300 dark:border-slate-600'
                }`}
              >
                ✕
              </button>
              {TASK_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => pick(c)}
                  title={c}
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${COLOR_DOT[c]} ${
                    value === c ? 'ring-2 ring-slate-400 ring-offset-2 dark:ring-offset-slate-800' : ''
                  }`}
                >
                  {value === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
