// src/boot/axios.js
import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'

// Instancia base de la API
const api = axios.create({
  baseURL: 'http://localhost:5066'
})

// === INTERCEPTOR DE REQUEST: agrega el token en cada request ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // o donde lo estés guardando

    if (token) {
      // Enviar JWT al backend
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// === INTERCEPTOR DE RESPONSE: si el token es inválido / vencido => logout ===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.clear()

      Notify.create({
        type: 'warning',
        message: 'Tu sesión expiró o no tienes autorización. Vuelve a iniciar sesión.',
        position: 'top'
      })

      // Redirige al login
      window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
