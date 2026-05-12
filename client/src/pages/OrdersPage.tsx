import api from '@/api/client'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Order } from '@/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    api.get<Order[]>('/orders/mine').then(({ data }) => setOrders(data))
  }, [])

  if (!orders) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track status and view receipts.</p>
      <div className="mt-8 space-y-4">
        {orders.length === 0 && (
          <p className="text-muted-foreground">
            No orders yet.{' '}
            <Link to="/products" className="font-medium text-accent hover:underline">
              Start shopping
            </Link>
          </p>
        )}
        {orders.map((o) => (
          <Card key={o._id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{o.paymentStatus}</Badge>
                  <Badge variant="accent">{o.orderStatus}</Badge>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {o.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between text-muted-foreground">
                    <span>
                      {it.title} × {it.quantity}
                    </span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <span>Total</span>
                <span>${o.totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
