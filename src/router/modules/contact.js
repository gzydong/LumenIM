export default {
  path: '/contact',
  name: 'contact',
  redirect: '/contact/friend',
  component: () => import('@/views/contact/layout.vue'),
  children: [
    {
      path: '/contact/organize',
      meta: { auth: true },
      component: () => import('@/views/contact/organize.vue')
    },
    {
      path: '/contact/friend',
      meta: { auth: true },
      component: () => import('@/views/contact/friends.vue')
    },
    {
      path: '/contact/apply',
      meta: { auth: true },
      component: () => import('@/views/contact/apply.vue')
    },
    {
      path: '/contact/group',
      meta: { auth: true },
      component: () => import('@/views/contact/groups.vue')
    },
    {
      path: '/contact/group/open',
      meta: { auth: true },
      component: () => import('@/views/contact/open-group.vue')
    }
  ]
}
