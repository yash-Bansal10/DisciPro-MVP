import { create } from 'zustand'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  checkAuth: async () => {
    try {
      const res = await api.get('/users/me')
      set({ user: res.data.data, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
      localStorage.removeItem('token')
    }
  },
  login: async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const res = await api.post('/token', formData)
    localStorage.setItem('token', res.data.access_token)
    
    const userRes = await api.get('/users/me')
    set({ user: userRes.data.data, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
  }
}))
