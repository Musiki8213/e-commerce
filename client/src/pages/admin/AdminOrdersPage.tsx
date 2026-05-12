import api from '@/api/client'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Order } from '@/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const statuses = ['processing', 'shipped', 'delivered', 'cancelled'] as const

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  const load = () => api.get<Order[]>('/orders/all').then(({ data }) => setOrders(data))

  useEffect(() => {
    void load()
  }, [])

  const update = async (id: string, orderStatus: (typeof statuses)[number]) => {
    try {
      await api.patch(`/orders/${id}/status`, { orderStatus })
      toast.success('Status updated')
      await load()
    } catch {
      /* */
    }
  }

  if (!orders) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/admin" className="text-sm text-accent hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((o) => {
          const u = o.user as { name?: string; email?: string } | undefined
          return (
            <Card key={o._id}>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">#{o._id.slice(-8).toUpperCase()}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                    {u && ` · ${u.name || ''} (${u.email || ''})`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{o.paymentStatus}</Badge>
                  <select
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                    value={o.orderStatus}
                    onChange={(e) => update(o._id, e.target.value as (typeof statuses)[number])}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-muted-foreground">
                    <span>
                      {it.title} × {it.quantity}
                    </span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span>Total</span>
                  <span>${o.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
