import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Instancia base de la API
const api = axios.create({
  baseURL: 'http://localhost:5066'
})

// === INTERCEPTOR: agrega el token en cada request ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // o donde lo estés guardando

    if (token) {
      // Enviar JWT al backend
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
