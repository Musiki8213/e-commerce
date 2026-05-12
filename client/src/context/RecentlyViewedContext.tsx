import type { Product } from '@/types'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const Ctx = createContext<{ items: Product[]; push: (p: Product) => void } | null>(null)
const KEY = 'nova-recent'
const MAX = 8

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Product[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const push = useCallback((p: Product) => {
    setItems((prev) => {
      const rest = prev.filter((x) => x._id !== p._id)
      return [p, ...rest].slice(0, MAX)
    })
  }, [])

  const value = useMemo(() => ({ items, push }), [items, push])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useRecentlyViewed() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return v
}
