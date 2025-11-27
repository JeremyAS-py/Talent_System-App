const routes = [
  // Ruta inicial: Login
  {
    path: '/',
    name: 'login',
    component: () => import('src/components/auth/LoginForm.vue'),
  },

  // Ruta para la app principal con MainLayout
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // redirige /app -> /app/vista-general
      {
        path: '',
        redirect: '/app/vista-general',
      },

      // Vista General (IndexPage)
      {
        path: 'vista-general',
        name: 'vista-general',
        component: () => import('pages/IndexPage.vue'),
      },

      // Skill Mapping (por ahora mismo componente; luego lo cambias)
      {
        path: 'skill-mapping',
        name: 'skill-mapping',
        component: () => import('pages/IndexPage.vue'),
        // TODO: cambia a pages/SkillMappingPage.vue cuando lo tengas
      },

      // Demanda de Talento
      {
        path: 'demanda-talento',
        name: 'demanda-talento',
        component: () => import('pages/DemandaTalentoPage.vue'),
        // TODO: cambia a pages/DemandaTalentoPage.vue
      },

      // Brechas de Skill
      {
        path: 'brechas-skill',
        name: 'brechas-skill',
        component: () => import('pages/IndexPage.vue'),
        // TODO: cambia a pages/BrechasSkillPage.vue
      },

      // Crear vacante
      {
        path: 'crear-vacante',
        name: 'crear-vacante',
        component: () => import('pages/CreateVacancyPage.vue'),
      },

      // Registrar colaborador (de momento reusa IndexPage)
      {
        path: 'colaboradores/registrar',
        name: 'registrar-colaborador',
        component: () => import('pages/IndexPage.vue'),
        // TODO: cambia a pages/RegistrarColaboradorPage.vue cuando la crees
      },
    ],
  },

  // Siempre al final
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
