import api from '@/api/client'
import type { User } from '@/types'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type AuthCtx = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateProfile: (payload: { name?: string; email?: string; avatar?: string }) => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const persist = useCallback((t: string | null, u: User | null) => {
    setToken(t)
    setUser(u)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
    if (u) localStorage.setItem('user', JSON.stringify(u))
    else localStorage.removeItem('user')
  }, [])

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem('token')
    if (!t) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get<{ user: User }>('/auth/me')
      setUser(data.user)
    } catch {
      persist(null, null)
    } finally {
      setLoading(false)
    }
  }, [persist])

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User)
      } catch {
        /* ignore */
      }
    }
    void refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      persist(data.token, data.user)
    },
    [persist]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<{ token: string; user: User }>('/auth/register', {
        name,
        email,
        password,
      })
      persist(data.token, data.user)
    },
    [persist]
  )

  const logout = useCallback(() => {
    persist(null, null)
  }, [persist])

  const updateProfile = useCallback(
    async (payload: { name?: string; email?: string; avatar?: string }) => {
      const { data } = await api.patch<{ user: User }>('/auth/profile', payload)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    []
  )

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshUser, updateProfile }),
    [user, token, loading, login, register, logout, refreshUser, updateProfile]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
