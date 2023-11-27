export default {
  path: '/settings',
  name: 'settings',
  redirect: '/settings/detail',
  component: () => import('@/views/setting/layout.vue'),
  children: [
    {
      path: '/settings/detail',
      meta: { auth: true },
      component: () => import('@/views/setting/detail.vue')
    },
    {
      path: '/settings/security',
      meta: { auth: true },
      component: () => import('@/views/setting/security.vue')
    },
    {
      path: '/settings/binding',
      meta: { auth: true },
      component: () => import('@/views/setting/binding.vue')
    },
    {
      path: '/settings/personalize',
      meta: { auth: true },
      component: () => import('@/views/setting/personalize.vue')
    },
    {
      path: '/settings/notification',
      meta: { auth: true },
      component: () => import('@/views/setting/notification.vue')
    }
  ]
}
