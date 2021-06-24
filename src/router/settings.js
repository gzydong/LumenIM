export default {
  path: '/settings',
  name: 'settings',
  meta: {
    title: '个人设置',
    needLogin: true,
  },
  redirect: '/settings/detail',
  component: () => import('@/views/settings/layout'),
  children: [
    {
      path: '/settings/detail',
      meta: {
        title: '个人信息',
        needLogin: true,
      },
      component: () => import('@/views/settings/detail'),
    },
    {
      path: '/settings/security',
      meta: {
        title: '安全设置',
        needLogin: true,
      },
      component: () => import('@/views/settings/security'),
    },
    {
      path: '/settings/binding',
      meta: {
        title: '账户绑定',
        needLogin: true,
      },
      component: () => import('@/views/settings/binding'),
    },
    {
      path: '/settings/personalize',
      meta: {
        title: '个性化设置',
        needLogin: true,
      },
      component: () => import('@/views/settings/personalize'),
    },
    {
      path: '/settings/notification',
      meta: {
        title: '消息设置',
        needLogin: true,
      },
      component: () => import('@/views/settings/notification'),
    },
  ],
}
