export type UserRole = 'customer' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt?: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: Category | string
  stock: number
  images: string[]
  rating: number
  numReviews: number
  featured?: boolean
  brand?: string
  createdAt?: string
}

export interface Review {
  _id: string
  user: { _id: string; name: string; avatar?: string }
  product: string
  rating: number
  comment: string
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  _id: string
  user?: string | User
  items: {
    product: Product | string
    title: string
    image: string
    price: number
    quantity: number
  }[]
  shippingInfo: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  totalPrice: number
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

export interface PaginatedProducts {
  products: Product[]
  page: number
  pages: number
  total: number
}

export interface AdminStats {
  totalSales: number
  totalUsers: number
  totalOrders: number
  totalProducts: number
  topProducts: { productId: string; title: string; sold: number; revenue: number }[]
}
