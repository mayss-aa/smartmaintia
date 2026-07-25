import axios from 'axios'
import { env } from '@/config/env'
import { ROUTES } from '@/constants/routes'

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getToken(): string | null {
  return sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token')
}

api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('currentUser')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('currentUser')
      window.location.href = ROUTES.LOGIN
    }
    return Promise.reject(error)
  },
)

export default api
