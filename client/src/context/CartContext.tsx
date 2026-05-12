import type { CartItem, Product } from '@/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type CartCtx = {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  subtotal: number
  count: number
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'nova-cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product._id === product._id)
      if (i === -1) return [...prev, { product, quantity: qty }]
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + qty }
      return next
    })
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.product._id !== productId))
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((x) => x.product._id !== productId))
      return
    }
    setItems((prev) =>
      prev.map((x) => (x.product._id === productId ? { ...x, quantity: qty } : x))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.product.price * x.quantity, 0),
    [items]
  )
  const count = useMemo(() => items.reduce((s, x) => s + x.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, subtotal, count }),
    [items, add, remove, setQty, clear, subtotal, count]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCart must be used within CartProvider')
  return v
}
