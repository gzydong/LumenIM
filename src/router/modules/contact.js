export default {
  path: '/contact',
  name: 'contact',
  redirect: '/contact/friend',
  component: () => import('@/views/contact/layout.vue'),
  children: [
    {
      path: '/contact/organize',
      meta: { requiresAuth: true },
      component: () => import('@/views/contact/organize.vue'),
    },
    {
      path: '/contact/friend',
      meta: { requiresAuth: true },
      component: () => import('@/views/contact/friends.vue'),
    },
    {
      path: '/contact/apply',
      meta: { requiresAuth: true },
      component: () => import('@/views/contact/apply.vue'),
    },
    {
      path: '/contact/group',
      meta: { requiresAuth: true },
      component: () => import('@/views/contact/groups.vue'),
    },
    {
      path: '/contact/group/open',
      meta: { requiresAuth: true },
      component: () => import('@/views/contact/open-group.vue'),
    },
  ],
}
