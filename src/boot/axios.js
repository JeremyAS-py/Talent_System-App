import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// Use relative baseURL so dev-server proxy `/api` works and no CORS from frontend.
// Setting baseURL to '/api' makes calls simpler: `api.get('/Colaborador')`.
const api = axios.create({ baseURL: '/api' })

// read token from localStorage (set by your login flow) and attach to default headers
function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
    delete axios.defaults.headers.common['Authorization']
  }
}

// initialize from storage if present
try {
  const stored = localStorage.getItem('authToken')
  if (stored) setAuthToken(stored)
} catch {
  // ignore (e.g., SSR or no localStorage)
}

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, setAuthToken }
