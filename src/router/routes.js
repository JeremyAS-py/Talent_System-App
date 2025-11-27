const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      // English pages added
      { path: 'bulk-upload', component: () => import('pages/BulkUploadPage.vue') },
      { path: 'skill-gaps', component: () => import('pages/SkillGapsPage.vue') },
      { path: 'training-plan', component: () => import('pages/TrainingPlanPage.vue') },
      { path: 'skill-mapping', component: () => import('pages/SkillMappingPage.vue') },

      // 👉 Tu ruta SIEMPRE DEBE IR DENTRO DEL children
      {
        path: 'crear-vacante',
        component: () => import('pages/CreateVacancyPage.vue'),
      },
    ],
  },

  // 👇 Esta SIEMPRE va como ÚLTIMA
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
