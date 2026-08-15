import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, ensureCsrf } from '../lib/api'
import Logo from '../components/Logo'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      await ensureCsrf()
      await api.post('/reset-password', { token, email, password, password_confirmation: confirm })
      setMsg({ ok: true, text: 'Password reset — you can sign in now.' })
      setTimeout(() => navigate('/login'), 1300)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setMsg({ ok: false, text: e.response?.data?.message ?? 'Reset failed. The link may have expired.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <Logo size={24} />
          <h1 className="text-xl font-semibold">Reset password</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">Email</span>
            <input value={email} readOnly className={`${inputCls} text-slate-400`} />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">New password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500">Confirm password</span>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputCls} />
          </div>
          {msg && <p className={`text-sm ${msg.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{msg.text}</p>}
          <button
            type="submit"
            disabled={busy || !token}
            className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Please wait…' : 'Reset password'}
          </button>
        </form>
        <button onClick={() => navigate('/login')} className="mt-4 w-full text-center text-sm text-brand hover:underline">
          Back to sign in
        </button>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand'
