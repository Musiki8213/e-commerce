import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { useWishlist } from '@/context/WishlistContext'
import { Link } from 'react-router-dom'

export function WishlistPage() {
  const { list, clear } = useWishlist()

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Save items you love from product pages.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button variant="accent">Browse products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
        <Button variant="outline" onClick={clear}>
          Clear all
        </Button>
      </div>
      <div className="mt-10">
        <ProductGrid products={list} />
      </div>
    </div>
  )
}
