import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold">
            MS<span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Premium athletic essentials. Crafted for motion, designed for the city.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-accent">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/products?sort=newest" className="hover:text-accent">
                  New arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default">Shipping</span>
              </li>
              <li>
                <span className="cursor-default">Returns</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/dashboard" className="hover:text-accent">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-accent">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MS Commerce. Demo project.
      </div>
    </footer>
  )
}
