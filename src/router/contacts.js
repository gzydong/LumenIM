export default {
  path: '/contacts',
  name: 'contacts',
  redirect: '/contacts/apply',
  component: () => import('@/views/contacts/layout'),
  children: [
    {
      path: '/contacts/apply',
      meta: {
        title: '我的联系人',
        needLogin: false,
      },
      component: () => import('@/views/contacts/apply'),
    },
    {
      path: '/contacts/friends',
      meta: {
        title: '我的好友',
        needLogin: false,
      },
      component: () => import('@/views/contacts/friends'),
    },
    {
      path: '/contacts/groups',
      meta: {
        title: '我的群组',
        needLogin: false,
      },
      component: () => import('@/views/contacts/groups'),
    },
  ],
}
