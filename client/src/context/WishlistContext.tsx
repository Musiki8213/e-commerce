import type { Product } from '@/types'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type WishlistCtx = {
  ids: Set<string>
  list: Product[]
  toggle: (p: Product) => void
  has: (id: string) => boolean
  clear: () => void
}

const Ctx = createContext<WishlistCtx | null>(null)
const KEY = 'nova-wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Product[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(list))
  }, [list])

  const ids = useMemo(() => new Set(list.map((p) => p._id)), [list])

  const toggle = useCallback((p: Product) => {
    setList((prev) => (prev.some((x) => x._id === p._id) ? prev.filter((x) => x._id !== p._id) : [...prev, p]))
  }, [])

  const has = useCallback((id: string) => ids.has(id), [ids])

  const clear = useCallback(() => setList([]), [])

  const value = useMemo(() => ({ ids, list, toggle, has, clear }), [ids, list, toggle, has, clear])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWishlist() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWishlist must be used within WishlistProvider')
  return v
}
