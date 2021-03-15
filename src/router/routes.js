
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/plansize.vue') }
    ]
  },
  {
    path: '/sysgen',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/sysgen.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
