import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { useDialog } from '../store/dialog'

// Renders the active prompt/confirm dialog (see store/dialog.ts). Mounted once
// in Layout so any code can call showPrompt()/showConfirm().
export default function DialogHost() {
  const active = useDialog((s) => s.active)
  const setActive = useDialog((s) => s.setActive)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (active?.kind === 'prompt') {
      setValue(active.defaultValue ?? '')
      const t = setTimeout(() => inputRef.current?.select(), 60)
      return () => clearTimeout(t)
    }
  }, [active])

  if (!active) return null
  const current = active

  function finish(result: string | null | boolean) {
    current.resolve(result as never)
    setActive(null)
  }

  const cancel = () => finish(current.kind === 'prompt' ? null : false)

  return (
    <Modal onClose={cancel}>
      <div className="p-5">
        <h2 className="text-base font-semibold">{active.title}</h2>

        {active.kind === 'prompt' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (value.trim()) finish(value.trim())
            }}
            className="mt-3 space-y-4"
          >
            {active.label && <label className="block text-xs text-slate-400">{active.label}</label>}
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={active.placeholder}
              className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand dark:border-slate-700"
            />
            <Buttons cancel={cancel} confirmText={active.confirmText ?? 'OK'} disabled={!value.trim()} />
          </form>
        ) : (
          <>
            {active.message && <p className="mt-2 text-sm text-slate-500">{active.message}</p>}
            <div className="mt-5">
              <Buttons cancel={cancel} confirmText={active.confirmText ?? 'Confirm'} danger={active.danger} onConfirm={() => finish(true)} />
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

function Buttons({
  cancel,
  confirmText,
  danger,
  disabled,
  onConfirm,
}: {
  cancel: () => void
  confirmText: string
  danger?: boolean
  disabled?: boolean
  onConfirm?: () => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={cancel} className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        Cancel
      </button>
      <button
        type={onConfirm ? 'button' : 'submit'}
        onClick={onConfirm}
        disabled={disabled}
        className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-40 ${
          danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:opacity-90'
        }`}
      >
        {confirmText}
      </button>
    </div>
  )
}
