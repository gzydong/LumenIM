export default {
  path: '/auth',
  name: 'auth',
  redirect: '/auth/register',
  component: () => import('@/views/auth/layout.vue'),
  children: [
    {
      path: '/auth/login',
      meta: { requiresAuth: false },
      component: () => import('@/views/auth/login.vue'),
    },
    {
      path: '/auth/register',
      meta: { requiresAuth: false },
      component: () => import('@/views/auth/register.vue'),
    },
    {
      path: '/auth/forget',
      meta: { requiresAuth: false },
      component: () => import('@/views/auth/forget.vue'),
    },
  ],
}
