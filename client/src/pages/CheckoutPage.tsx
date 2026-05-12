import api from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCart } from '@/context/CartContext'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const empty = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
}

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const nav = useNavigate()
  const [ship, setShip] = useState(empty)
  const [card, setCard] = useState({ name: '', number: '', mockSuccess: true })
  const [busy, setBusy] = useState(false)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" variant="accent" onClick={() => nav('/products')}>
          Go to shop
        </Button>
      </div>
    )
  }

  const onChange = (k: keyof typeof empty, v: string) => setShip((s) => ({ ...s, [k]: v }))

  const place = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingInfo: ship,
        mockPayment: { success: card.mockSuccess },
      })
      clear()
      toast.success('Order placed')
      nav('/orders')
    } catch {
      /* toast */
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]" onSubmit={place}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">Full name</label>
                <Input required className="mt-1" value={ship.fullName} onChange={(e) => onChange('fullName', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">Address line 1</label>
                <Input required className="mt-1" value={ship.line1} onChange={(e) => onChange('line1', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">Address line 2</label>
                <Input className="mt-1" value={ship.line2} onChange={(e) => onChange('line2', e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">City</label>
                <Input required className="mt-1" value={ship.city} onChange={(e) => onChange('city', e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">State</label>
                <Input required className="mt-1" value={ship.state} onChange={(e) => onChange('state', e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Postal code</label>
                <Input required className="mt-1" value={ship.postalCode} onChange={(e) => onChange('postalCode', e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Country</label>
                <Input required className="mt-1" value={ship.country} onChange={(e) => onChange('country', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">Phone</label>
                <Input required className="mt-1" value={ship.phone} onChange={(e) => onChange('phone', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mock payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a demo. No real charges occur. Toggle success to simulate a declined card.
              </p>
              <div>
                <label className="text-sm text-muted-foreground">Name on card</label>
                <Input className="mt-1" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Card number</label>
                <Input
                  className="mt-1"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={card.mockSuccess}
                  onChange={(e) => setCard((c) => ({ ...c, mockSuccess: e.target.checked }))}
                />
                Payment succeeds (uncheck to simulate decline)
              </label>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((i) => (
              <div key={i.product._id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {i.product.title} × {i.quantity}
                </span>
                <span>${(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 text-lg font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" variant="accent" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Placing order…' : 'Place order'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
