export default {
  path: '/auth',
  name: 'auth',
  redirect: '/auth/register',
  component: () => import('@/views/auth/layout.vue'),
  children: [
    {
      path: '/auth/login',
      meta: { auth: false },
      component: () => import('@/views/auth/login.vue')
    },
    {
      path: '/auth/register',
      meta: { auth: false },
      component: () => import('@/views/auth/register.vue')
    },
    {
      path: '/auth/forget',
      meta: { auth: false },
      component: () => import('@/views/auth/forget.vue')
    }
  ]
}
