import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import api from '@/api/client'
import type { Order } from '@/types'
import { Package, Heart } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export function DashboardPage() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isEdit = searchParams.get('section') === 'edit'
  const [nameDraft, setNameDraft] = useState(user?.name ?? '')
  const [emailDraft, setEmailDraft] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setNameDraft(user?.name ?? '')
    setEmailDraft(user?.email ?? '')
  }, [user?.name, user?.email])

  useEffect(() => {
    api.get<Order[]>('/orders/mine').then(({ data }) => setOrders(data.slice(0, 3)))
  }, [])

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = nameDraft.trim()
    const email = emailDraft.trim()
    if (!name || !emailOk(email)) return
    setSaving(true)
    try {
      await updateProfile({ name, email })
      setSearchParams({}, { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user?.name}.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <CardTitle>Profile</CardTitle>
            {!isEdit && (
              <Link
                to="/dashboard?section=edit"
                className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                Edit information
              </Link>
            )}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {isEdit ? (
              <form className="space-y-4" onSubmit={saveProfile}>
                <div>
                  <label htmlFor="dash-name" className="text-xs font-medium text-muted-foreground">
                    Name
                  </label>
                  <Input
                    id="dash-name"
                    className="mt-1.5"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="dash-email" className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <Input
                    id="dash-email"
                    type="email"
                    className="mt-1.5"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={saving || !nameDraft.trim() || !emailOk(emailDraft)}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </Button>
                  <Link
                    to="/dashboard"
                    className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant={user?.role === 'admin' ? 'accent' : 'default'}>{user?.role}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link to="/orders">
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                Order history
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="accent">View cart</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <Link to="/orders" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
          {orders.map((o) => (
            <Card key={o._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">Order #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{o.orderStatus}</Badge>
                  <span className="font-semibold">${o.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign out on this device. You can sign in again anytime.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => { logout(); navigate('/') }}>
          Log out
        </Button>
      </section>
    </div>
  )
}
