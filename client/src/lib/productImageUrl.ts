const PLACEHOLDER = '/placeholder.svg'

/**
 * Product `images[]` values should be absolute paths (`/product-images/...`) or full URLs.
 * If the path has no leading `/`, the browser resolves it against the current route and images 404.
 * Respects Vite `base` when the app is not deployed at `/`.
 */
export function productImageUrl(src: string | undefined | null): string {
  if (src == null || typeof src !== 'string') return PLACEHOLDER
  const s = src.trim()
  if (!s) return PLACEHOLDER
  if (/^https?:\/\//i.test(s)) return s

  let path = s.startsWith('/') ? s : `/${s}`

  const base = import.meta.env.BASE_URL || '/'
  if (base !== '/') {
    const b = base.endsWith('/') ? base.slice(0, -1) : base
    if (!path.startsWith(`${b}/`) && path !== b) {
      path = `${b}${path}`
    }
  }

  return path
}
