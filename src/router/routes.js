const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      // 👉 Tu ruta SIEMPRE DEBE IR DENTRO DEL children
      {
        path: 'crear-vacante',
        component: () => import('pages/CreateVacancyPage.vue')
      }
    ]
  },

  // 👇 Esta SIEMPRE va como ÚLTIMA
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
