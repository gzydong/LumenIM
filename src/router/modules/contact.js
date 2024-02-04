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
      component: () => import('@/views/contact/friend.vue')
    },
    {
      path: '/contact/friend/apply',
      meta: { auth: true },
      component: () => import('@/views/contact/friend-apply.vue')
    },
    {
      path: '/contact/group',
      meta: { auth: true },
      component: () => import('@/views/contact/group.vue')
    },
    {
      path: '/contact/group/apply',
      meta: { auth: true },
      component: () => import('@/views/contact/group-apply.vue')
    },
    {
      path: '/contact/open-group',
      meta: { auth: true },
      component: () => import('@/views/contact/open-group.vue')
    }
  ]
}
