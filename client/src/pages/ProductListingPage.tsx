import api from '@/api/client'
import { Pagination } from '@/components/product/Pagination'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Category, Product } from '@/types'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SHOP_FILTERS_ID = 'shop-filters'

export function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<{ products: Product[]; page: number; pages: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)
  const [mobileFilters, setMobileFilters] = useState(false)

  useEffect(() => {
    const fromUrl = searchParams.get('search') || ''
    if (fromUrl) {
      setSearch(fromUrl)
      setQ(fromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const s = searchParams.get('sort')
    if (s && ['newest', 'price_asc', 'price_desc', 'rating'].includes(s)) {
      setSort(s)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('section') !== 'categories') return
    setMobileFilters(true)
    const id = window.setTimeout(() => {
      document.getElementById(SHOP_FILTERS_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(id)
  }, [searchParams])

  const params = useMemo(
    () => ({
      page,
      limit: 12,
      search: q || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      sort,
    }),
    [page, q, category, minPrice, maxPrice, minRating, sort]
  )

  useEffect(() => {
    api.get<Category[]>('/categories').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    let alive = true
    api
      .get('/products', { params })
      .then(({ data }) => alive && setData(data))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [params])

  const applySearch = () => {
    setPage(1)
    setQ(search.trim())
    const next = new URLSearchParams(searchParams)
    if (search.trim()) next.set('search', search.trim())
    else next.delete('search')
    setSearchParams(next, { replace: true })
  }

  const reset = () => {
    setSearch('')
    setQ('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
    setSort('newest')
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  const FilterForm = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Category</p>
        <select
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-sm font-semibold">Price</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value)
              setPage(1)
            }}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">Minimum rating</p>
        <select
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={minRating}
          onChange={(e) => {
            setMinRating(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Any</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>
      </div>
      <div>
        <p className="text-sm font-semibold">Sort</p>
        <select
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setPage(1)
          }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={reset}>
        Reset filters
      </Button>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} products` : 'Browse the full catalog.'}
          </p>
        </div>
        <div className="flex w-full gap-2 sm:max-w-md">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
          />
          <Button type="button" variant="accent" onClick={applySearch} aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex lg:hidden">
        <Button type="button" variant="outline" className="gap-2" onClick={() => setMobileFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside
          id={SHOP_FILTERS_ID}
          className={`${
            mobileFilters ? 'block' : 'hidden'
          } w-full shrink-0 lg:block lg:w-64`}
        >
          <div className="sticky top-24 rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="text-base font-semibold">Filters</p>
            <div className="mt-4">{FilterForm}</div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading || !data ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
              ))}
            </div>
          ) : data.products.length === 0 ? (
            <p className="text-muted-foreground">No products match your filters.</p>
          ) : (
            <>
              <ProductGrid products={data.products} />
              <Pagination page={data.page} pages={data.pages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
