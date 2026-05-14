import { ProductImage } from '@/components/product/ProductImage'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import type { Product } from '@/types'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { cn } from '@/lib/utils'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const img = product.images[0]
  const cat = typeof product.category === 'object' ? product.category.name : ''

  return (
    <Card className={cn('group overflow-hidden border-border/60', className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link to={`/products/${product._id}`}>
          <ProductImage
            src={img}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggle(product)}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow backdrop-blur transition hover:bg-background"
          aria-label="Wishlist"
        >
          <Heart className={cn('h-4 w-4', has(product._id) && 'fill-accent text-accent')} />
        </button>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
            Featured
          </span>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{cat}</p>
            <Link to={`/products/${product._id}`}>
              <h3 className="mt-1 line-clamp-2 font-medium leading-snug hover:text-accent">{product.title}</h3>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{Number(product.rating || 0).toFixed(1)}</span>
          <span>({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
          <Button
            size="sm"
            variant="accent"
            className="gap-1"
            onClick={() => add(product, 1)}
            disabled={product.stock < 1}
          >
            <ShoppingBag className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
