import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ensureCsrf, unwrap } from '../lib/api'
import type { User } from '../lib/types'
import { useUI } from '../store/ui'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string, remember: boolean) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
  updateSettings: (settings: Record<string, unknown>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const setTheme = useUI((s) => s.setTheme)

  function adoptUser(u: User | null) {
    setUser(u)
    const theme = u?.settings?.theme
    if (theme === 'dark' || theme === 'light') setTheme(theme)
  }

  useEffect(() => {
    api
      .get('/user')
      .then(({ data }) => adoptUser(unwrap<User>(data)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the server in sync with the browser's timezone (for correct due/today math).
  useEffect(() => {
    if (!user) return
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && user.settings?.timezone !== tz) {
      updateSettings({ timezone: tz }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function login(email: string, password: string, remember: boolean) {
    await ensureCsrf()
    const { data } = await api.post('/login', { email, password, remember })
    adoptUser(unwrap<User>(data))
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    await ensureCsrf()
    const { data } = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    adoptUser(unwrap<User>(data))
  }

  async function logout() {
    await ensureCsrf()
    await api.post('/logout')
    setUser(null)
  }

  async function updateSettings(settings: Record<string, unknown>) {
    await ensureCsrf()
    const { data } = await api.put('/settings', { settings })
    adoptUser(unwrap<User>(data))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateSettings }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
