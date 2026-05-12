import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navigate, Outlet } from 'react-router-dom'

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
