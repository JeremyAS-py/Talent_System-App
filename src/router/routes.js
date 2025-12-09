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

      // VISTA GENERAL
      {
        path: 'vista-general',
        name: 'vista-general',
        component: () => import('pages/IndexPage.vue'),
      },

      // SKILL MAPPING
      {
        path: 'skill-mapping',
        name: 'skill-mapping',
        component: () => import('pages/SkillMappingPage.vue'),
      },

      // DEMANDA TALENTO
      {
        path: 'demanda-talento',
        name: 'demanda-talento',
        component: () => import('pages/DemandaTalentoPage.vue'),
      },

      // BRECHAS SKILL
      {
        path: 'brechas-skill',
        name: 'brechas-skill',
        component: () => import('pages/BrechasSkillPage.vue'),
      },

      // PERFIL COLABORADOR
      {
        path: 'perfil-colaborador/:id',
        name: 'perfil-colaborador',
        component: () => import('pages/PerfilColabPage.vue'),
        props: (route) => ({
          colaboradorId: Number(route.params.id),
        }),
      },

      // CREAR VACANTE
      {
        path: 'crear-vacante',
        name: 'crear-vacante',
        component: () => import('pages/CreateVacancyPage.vue'),
      },

      // REGISTRAR COLABORADOR
      {
        path: 'colaboradores/registrar',
        name: 'registrar-colaborador',
        component: () => import('components/RegisterColabForm.vue'),
      },

      // AUDITORÍA (LA QUE TE DA PROBLEMA)
      {
        path: 'auditoria', // => /app/auditoria
        name: 'auditoria',
        component: () => import('pages/AuditoriaPage.vue'),
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
