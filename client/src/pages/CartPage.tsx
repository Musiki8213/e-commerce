import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ProductImage } from '@/components/product/ProductImage'
import { useCart } from '@/context/CartContext'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse the shop and add items you love.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button variant="accent">Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
        <Button variant="ghost" onClick={clear}>
          Clear cart
        </Button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((line) => (
            <Card key={line.product._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link to={`/products/${line.product._id}`} className="shrink-0">
                  <ProductImage
                    src={line.product.images[0]}
                    alt=""
                    className="h-28 w-28 rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${line.product._id}`} className="font-medium hover:text-accent">
                    {line.product.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">${line.product.price.toFixed(2)} each</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQty(line.product._id, line.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">{line.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQty(line.product._id, line.quantity + 1)}
                        disabled={line.quantity >= line.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(line.product._id)}>
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-right text-lg font-semibold">
                  ${(line.product.price * line.quantity).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-4 text-lg font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block">
              <Button variant="accent" className="w-full" size="lg">
                Checkout
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
