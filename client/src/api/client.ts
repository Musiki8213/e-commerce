import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData && config.headers) {
    const h = config.headers as { 'Content-Type'?: string; delete?: (key: string) => void }
    if (typeof h.delete === 'function') h.delete('Content-Type')
    else delete h['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Request failed'
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    if (!err.config?.skipToast) {
      toast.error(typeof msg === 'string' ? msg : 'Something went wrong')
    }
    return Promise.reject(err)
  }
)

export default api
