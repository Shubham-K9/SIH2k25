import axios from 'axios'

// Determine the backend URL based on environment
const getBackendURL = () => {
  if (import.meta.env.DEV) {
    // Development: Backend runs on port 5000
    return 'http://localhost:5000/api'
  } else {
    // Production: Use relative path or environment variable
    return import.meta.env.VITE_API_URL || '/api'
  }
}

const api = axios.create({
  baseURL: getBackendURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add authentication token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('abha_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('abha_token')
      localStorage.removeItem('abha_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api


