import api from '@/api/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Category, Product } from '@/types'
import { Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const initial = {
  title: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  images: '',
  brand: 'MS',
  featured: false,
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)

  const load = () =>
    api.get<{ products: Product[] }>('/products', { params: { limit: 100 } }).then(({ data }) => {
      setProducts(data.products)
    })

  useEffect(() => {
    Promise.all([load(), api.get<Category[]>('/categories').then(({ data }) => setCategories(data))]).finally(() =>
      setLoading(false)
    )
  }, [])

  const reset = () => {
    setForm(initial)
    setEditingId(null)
    setFiles(null)
  }

  const edit = (p: Product) => {
    setEditingId(p._id)
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      category: typeof p.category === 'object' ? p.category._id : String(p.category),
      stock: String(p.stock),
      images: p.images.join('\n'),
      brand: p.brand || 'MS',
      featured: !!p.featured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      images: form.images
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      brand: form.brand,
      featured: form.featured,
    }
    try {
      let id = editingId
      if (editingId) {
        await api.put(`/products/${editingId}`, payload)
        toast.success('Product updated')
      } else {
        const { data } = await api.post<Product>('/products', payload)
        id = data._id
        toast.success('Product created')
      }
      if (files?.length && id) {
        const fd = new FormData()
        Array.from(files).forEach((f) => fd.append('images', f))
        await api.post(`/products/${id}/images`, fd)
        toast.success('Images uploaded')
      }
      await load()
      reset()
    } catch {
      /* toast */
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Deleted')
      await load()
      if (editingId === id) reset()
    } catch {
      /* */
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-sm text-accent hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Catalog</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 w-28" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-border last:border-0">
                      <td className="p-3 font-medium">{p.title}</td>
                      <td className="p-3">${p.price}</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="outline" onClick={() => edit(p)}>
                            Edit
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => remove(p._id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit product' : 'Add product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={save}>
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <Input required className="mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <textarea
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Price</label>
                  <Input required type="number" className="mt-1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Stock</label>
                  <Input required type="number" className="mt-1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <select
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Image URLs (one per line)</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.images}
                  onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Upload images (optional)</label>
                <Input type="file" multiple accept="image/*" className="mt-1 cursor-pointer" onChange={(e) => setFiles(e.target.files)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Brand</label>
                <Input className="mt-1" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="accent" className="flex-1">
                  {editingId ? 'Save changes' : 'Create'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={reset}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
