// src/router/index.js
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

  // ===== GUARD GLOBAL DE AUTENTICACIÓN + ROLES =====
  Router.beforeEach((to, from, next) => {
    // En el servidor NO tocamos localStorage
    if (process.env.SERVER) {
      return next()
    }

    let token = null
    let userRole = null

    try {
      token = localStorage.getItem('token')
      userRole = localStorage.getItem('rol')
    } catch (e) {
      console.error('Error accediendo a localStorage', e)
      // por si acaso algo raro pasa con localStorage
      token = null
      userRole = null
    }

    const requiresAuth = to.matched.some((r) => r.meta && r.meta.requiresAuth)

    // 1) Rutas protegidas sin token -> al login
    if (requiresAuth && !token) {
      return next({ name: 'login' })
    }

    // 2) Si ya estoy logueado e intento ir al login -> dashboard
    if (to.name === 'login' && token) {
      return next({ name: 'vista-general' })
    }

    // 3) Validación de roles por ruta (meta.allowedRoles)
    const allowedRoles =
      to.matched.filter((r) => r.meta && r.meta.allowedRoles).flatMap((r) => r.meta.allowedRoles) ||
      null

    if (allowedRoles && allowedRoles.length > 0) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // No tiene permiso -> lo mandamos a la vista general
        return next({ name: 'vista-general' })
      }
    }

    return next()
  })

  return Router
})
