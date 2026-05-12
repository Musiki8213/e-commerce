import api from '@/api/client'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api
      .get<{ products: Product[] }>('/products', { params: { featured: 'true', limit: 5, sort: 'rating' } })
      .then(({ data }) => {
        if (!alive) return
        setFeatured(data.products.slice(0, 5))
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover opacity-90 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-background dark:via-background/90" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-32">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">New season</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Engineered for motion. Designed for you.
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover performance footwear, technical layers, and accessories built with obsessive detail.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button variant="accent" size="lg" className="gap-2">
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products?sort=newest">
                <Button variant="outline" size="lg">
                  View latest drops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured picks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Curated from our catalog.</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <ProductGrid products={featured} className="xl:grid-cols-5" />
          )}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { t: 'Free shipping', d: 'On orders over $150' },
            { t: 'Easy returns', d: '30-day hassle-free policy' },
            { t: 'Secure checkout', d: '256-bit encryption' },
          ].map((x) => (
            <div key={x.t} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <p className="font-semibold">{x.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
