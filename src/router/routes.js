// src/router/routes.js

const ROLE_ADMIN = 'Admin'
const ROLE_RRHH = 'RRHH'
const ROLE_BM = 'Business Manager'

const routes = [
  // LOGIN
  {
    path: '/',
    name: 'login',
    component: () => import('src/components/auth/LoginForm.vue'),
  },

  // APP PRINCIPAL
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // cuando entras a /app te redirige a vista-general
      {
        path: '',
        redirect: { name: 'vista-general' },
      },

      // 1) VISTA GENERAL – todos los roles
      {
        path: 'vista-general',
        name: 'vista-general',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
        },
      },

      // 2) SKILL MAPPING – todos los roles
      {
        path: 'skill-mapping',
        name: 'skill-mapping',
        component: () => import('pages/SkillMappingPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
        },
      },

      // 3) DEMANDA TALENTO – matching / ranking (Admin, RRHH, BM)
      {
        path: 'demanda-talento',
        name: 'demanda-talento',
        component: () => import('pages/DemandaTalentoPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
        },
      },

      // 4) BRECHAS SKILL – todos los roles
      {
        path: 'brechas-skill',
        name: 'brechas-skill',
        component: () => import('pages/BrechasSkillPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
        },
      },

      // 5) PERFIL COLABORADOR – todos ven (BM solo lectura en el front)
      {
        path: 'perfil-colaborador/:id',
        name: 'perfil-colaborador',
        component: () => import('pages/PerfilColabPage.vue'),
        props: (route) => ({
          colaboradorId: Number(route.params.id),
        }),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
        },
      },

      // 6) CREAR VACANTE – solo Admin y RRHH
      {
        path: 'crear-vacante',
        name: 'crear-vacante',
        component: () => import('pages/CreateVacancyPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH],
        },
      },

      // 7) APROBACIÓN POSTULACIONES – solo Admin y RRHH
      {
        path: 'aprobacion-postulaciones',
        name: 'aprobacion-postulaciones',
        component: () => import('pages/AprobacionPostulacionesPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH],
        },
      },

      // 8) REGISTRAR COLABORADOR – solo Admin y RRHH
      {
        path: 'colaboradores/registrar',
        name: 'registrar-colaborador',
        component: () => import('components/RegisterColabForm.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN, ROLE_RRHH],
        },
        // TODO: cuando exista, cambia a pages/RegistrarColaboradorPage.vue
      },

      // 9) AUDITORÍA – solo Admin
      {
        path: 'auditoria',
        name: 'auditoria',
        component: () => import('pages/AuditoriaPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [ROLE_ADMIN],
        },
      },
    ],
  },

  // 404 SIEMPRE AL FINAL
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
