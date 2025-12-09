import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // 🔐 GUARD DE AUTENTICACIÓN
  // ===== GUARD GLOBAL DE AUTENTICACIÓN =====
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    // Revisamos si alguna ruta requiere autenticación
    const requiereAuth = to.matched.some((route) => route.meta.requiresAuth)

    if (requiereAuth && !token) {
      next({ name: 'login' })
    } else {
      next()
    }
  })

  return Router
})
