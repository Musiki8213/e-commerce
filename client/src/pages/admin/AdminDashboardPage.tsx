import api from '@/api/client'
import type { AdminStats } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { BarChart3, DollarSign, Package, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    api.get<AdminStats>('/admin/stats').then(({ data }) => setStats(data))
  }, [])

  if (!stats) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  const tiles = [
    { label: 'Total sales', value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign },
    { label: 'Users', value: String(stats.totalUsers), icon: Users },
    { label: 'Orders', value: String(stats.totalOrders), icon: Package },
    { label: 'Products', value: String(stats.totalProducts), icon: BarChart3 },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your store performance.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <span className="inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
              Products
            </span>
          </Link>
          <Link to="/admin/orders">
            <span className="inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
              Orders
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.label}</CardTitle>
              <t.icon className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{t.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Top products</h2>
        <Card className="mt-4">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Units sold</th>
                  <th className="p-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-muted-foreground">
                      No sales data yet.
                    </td>
                  </tr>
                )}
                {stats.topProducts.map((p) => (
                  <tr key={String(p.productId)} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{p.sold}</td>
                    <td className="p-3">${p.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
