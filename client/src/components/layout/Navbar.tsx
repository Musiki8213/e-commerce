import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const centerLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative pb-1 text-sm font-medium transition-colors',
    isActive
      ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent'
      : 'text-muted-foreground hover:text-foreground'
  )

function useCenterNavActive() {
  const { pathname, search } = useLocation()
  const qs = new URLSearchParams(search)
  const sort = qs.get('sort') || ''
  const section = qs.get('section') || ''
  const hasSearch = Boolean(qs.get('search')?.trim())
  const onProducts = pathname === '/products'

  return {
    shop: onProducts && !sort && !section && !hasSearch,
    categories: onProducts && section === 'categories',
    deals: onProducts && sort === 'price_asc',
    newArrivals: onProducts && sort === 'newest',
    pages:
      pathname === '/wishlist' ||
      pathname === '/orders' ||
      pathname === '/dashboard' ||
      pathname.startsWith('/admin'),
  }
}

function CenterNavLink({ to, active, children, onClick }: { to: string; active: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className={centerLink({ isActive: active })}>
      {children}
    </Link>
  )
}

export function Navbar() {
  const { user } = useAuth()
  const { count } = useCart()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const navActive = useCenterNavActive()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pagesRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Node
      if (pagesRef.current && !pagesRef.current.contains(t)) setPagesOpen(false)
      if (searchRef.current && !searchRef.current.contains(t)) setSearchOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchQuery.trim()
    setSearchOpen(false)
    setMobileOpen(false)
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`)
    else navigate('/products')
  }

  const centerNav = (
    <>
      <NavLink to="/" end className={centerLink}>
        Home
      </NavLink>
      <CenterNavLink to="/products" active={navActive.shop}>
        Shop
      </CenterNavLink>
      <CenterNavLink to="/products?section=categories" active={navActive.categories}>
        Categories
      </CenterNavLink>
      <CenterNavLink to="/products?sort=price_asc" active={navActive.deals}>
        Deals
      </CenterNavLink>
      <CenterNavLink to="/products?sort=newest" active={navActive.newArrivals}>
        New Arrivals
      </CenterNavLink>
      <div className="relative" ref={pagesRef}>
        <button
          type="button"
          className={cn(
            'relative flex items-center gap-0.5 pb-1 text-sm font-medium transition-colors hover:text-foreground',
            pagesOpen || navActive.pages
              ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent'
              : 'text-muted-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation()
            setPagesOpen((o) => !o)
          }}
          aria-expanded={pagesOpen}
          aria-haspopup="true"
        >
          Pages
          <ChevronDown className={cn('h-4 w-4 transition-transform', pagesOpen && 'rotate-180')} />
        </button>
        {pagesOpen && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 min-w-[10rem] -translate-x-1/2 rounded-lg border border-border bg-card py-1 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to="/wishlist"
              className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setPagesOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setPagesOpen(false)}
            >
              Orders
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setPagesOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/dashboard?section=edit"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setPagesOpen(false)}
                >
                  Edit information
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setPagesOpen(false)}
              >
                Account
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setPagesOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo — SHOPERA-style bag + wordmark (colors unchanged: accent + foreground tokens) */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <ShoppingBag className="h-6 w-6 shrink-0 text-accent" aria-hidden />
          <Link to="/" className="min-w-0 truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
            MS<span className="text-accent">.</span>
          </Link>
        </div>

        {/* Center nav — desktop only */}
        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8">{centerNav}</nav>

        {/* Right utilities */}
        <div className="ml-auto flex min-w-0 items-center gap-0.5 sm:gap-2">
          <div className="relative hidden sm:block" ref={searchRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Search"
              onClick={(e) => {
                e.stopPropagation()
                setSearchOpen((o) => !o)
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            {searchOpen && (
              <form
                onSubmit={submitSearch}
                className="absolute right-0 top-full z-50 mt-2 flex w-[min(100vw-2rem,18rem)] gap-2 rounded-lg border border-border bg-card p-2 shadow-card"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm" variant="accent" className="shrink-0">
                  Go
                </Button>
              </form>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <Link to="/dashboard" aria-label="Account">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login" aria-label="Log in">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative inline-flex" aria-label="Cart">
            <Button type="button" variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex gap-2">
            <Input
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="accent" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={centerLink} onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <CenterNavLink to="/products" active={navActive.shop} onClick={() => setMobileOpen(false)}>
              Shop
            </CenterNavLink>
            <CenterNavLink to="/products?section=categories" active={navActive.categories} onClick={() => setMobileOpen(false)}>
              Categories
            </CenterNavLink>
            <CenterNavLink to="/products?sort=price_asc" active={navActive.deals} onClick={() => setMobileOpen(false)}>
              Deals
            </CenterNavLink>
            <CenterNavLink to="/products?sort=newest" active={navActive.newArrivals} onClick={() => setMobileOpen(false)}>
              New Arrivals
            </CenterNavLink>
            <Link
              to="/wishlist"
              className={cn('py-2 text-sm font-medium', navActive.pages ? 'text-foreground' : 'text-muted-foreground')}
              onClick={() => setMobileOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              className={cn('py-2 text-sm font-medium', navActive.pages ? 'text-foreground' : 'text-muted-foreground')}
              onClick={() => setMobileOpen(false)}
            >
              Orders
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn('py-2 text-sm font-medium', navActive.pages ? 'text-foreground' : 'text-muted-foreground')}
                  onClick={() => setMobileOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/dashboard?section=edit"
                  className={cn('py-2 text-sm font-medium', navActive.pages ? 'text-foreground' : 'text-muted-foreground')}
                  onClick={() => setMobileOpen(false)}
                >
                  Edit information
                </Link>
              </>
            ) : (
              <Link to="/login" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            )}
          </nav>
          {!user && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="accent" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
