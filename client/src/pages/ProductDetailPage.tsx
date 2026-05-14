import api from '@/api/client'
import { ProductImage } from '@/components/product/ProductImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import { useWishlist } from '@/context/WishlistContext'
import type { Product, Review } from '@/types'
import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { productImageUrl } from '@/lib/productImageUrl'
import toast from 'react-hot-toast'

export function ProductDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const { push, items: recent } = useRecentlyViewed()

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!id) return
    let alive = true
    setLoading(true)
    setReviews([])
    setRelated([])

    api
      .get<{ product: Product; related: Product[] }>(`/products/${id}`)
      .then(({ data }) => {
        if (!alive) return
        setProduct(data.product)
        setMainImage(data.product.images[0] || '/placeholder.svg')
        setRelated(data.related)
        push(data.product)
      })
      .catch(() => {
        if (alive) toast.error('Product not found')
      })
      .finally(() => alive && setLoading(false))

    api
      .get<Review[]>(`/products/${id}/reviews`)
      .then(({ data }) => alive && setReviews(data))
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [id, push])

  const submitReview = async () => {
    if (!id || !user) {
      toast.error('Please log in to leave a review')
      return
    }
    await api.post(`/products/${id}/reviews`, { rating, comment })
    toast.success('Review saved')
    const { data } = await api.get<Review[]>(`/products/${id}/reviews`)
    setReviews(data)
    const { data: p } = await api.get<{ product: Product }>(`/products/${id}`)
    setProduct(p.product)
  }

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-96 w-full rounded-xl lg:h-[480px]" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const mainSrc = mainImage || product.images[0] || '/placeholder.svg'
  const img = productImageUrl(mainSrc)
  const cat = typeof product.category === 'object' ? product.category.name : ''
  const gallery = product.images.filter(Boolean)
  const thumbActive = (src: string) => productImageUrl(src) === img

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
            <ProductImage
              src={mainSrc}
              alt={product.title}
              className="aspect-square w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 8).map((src, idx) => (
                <button
                  type="button"
                  key={`${src}-${idx}`}
                  className={`overflow-hidden rounded-lg border ${
                    thumbActive(src) ? 'border-accent ring-2 ring-accent/30' : 'border-border'
                  }`}
                  onClick={() => setMainImage(src)}
                >
                  <ProductImage src={src} alt="" className="aspect-square w-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">{cat}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <Star className="h-5 w-5 shrink-0 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{(product.rating || 0).toFixed(1)}</span>
              <span>({product.numReviews} reviews)</span>
              <span className="hidden text-border sm:inline">|</span>
              <span>{product.stock} in stock</span>
            </div>
          </div>
          <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-border">
              <Button type="button" variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="accent"
              size="lg"
              className="min-h-11 flex-1 gap-2 sm:flex-initial"
              disabled={product.stock < 1}
              onClick={() => {
                add(product, qty)
                toast.success('Added to cart')
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to cart
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-11 shrink-0"
              onClick={() => toggle(product)}
            >
              <Heart className={has(product._id) ? 'h-5 w-5 fill-accent text-accent' : 'h-5 w-5'} />
            </Button>
          </div>
        </div>
      </div>

      {recent.filter((p) => p._id !== product._id).length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">Recently viewed</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recent
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
            {reviews.map((r) => (
              <Card key={r._id} className="border-border/80">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{r.user?.name || 'User'}</p>
                    <span className="text-sm text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="font-semibold">Write a review</h3>
            {!user && <p className="text-sm text-muted-foreground">Log in to share your experience.</p>}
            {user && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">Rating</label>
                  <select
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} stars
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Comment</label>
                  <textarea
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <Button variant="accent" onClick={submitReview}>
                  Submit review
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
