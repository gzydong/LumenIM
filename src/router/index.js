import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { isLogin } from '@/utils/auth.ts'
import MainLayout from '@/layout/MainLayout.vue'

import SettingRouter from './modules/setting.js'
import ContactRouter from './modules/contact.js'
import AuthRouter from './modules/auth.js'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { auth: true },
    component: MainLayout,
    redirect: '/message',
    children: [
      {
        path: '/message',
        name: 'message',
        meta: { auth: true },
        component: () => import('@/views/message/index.vue')
      },
      {
        path: '/note',
        name: 'note',
        meta: { auth: true },
        component: () => import('@/views/note/index.vue')
      },
      {
        path: '/example',
        name: 'example',
        meta: { auth: false },
        component: () => import('@/views/example/index.vue')
      },
      SettingRouter,
      ContactRouter
    ]
  },
  AuthRouter,
  {
    path: '/oauth/callback/:oauth_type',
    meta: { auth: false },
    component: () => import('@/views/auth/oauth.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404 NotFound',
    component: () => import('@/views/other/not-found.vue')
  }
]

const getHistoryMode = () => {
  return import.meta.env.VITE_ROUTER_MODE == 'hash' ? createWebHashHistory() : createWebHistory()
}

const router = createRouter({
  history: getHistoryMode(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置中间件，权限验证
router.beforeEach((to) => {
  const login = isLogin()

  if (to.meta?.auth && !login) {
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath }
    }
  }

  if (['/auth/login'].includes(to.path) && login) {
    return { path: '/' }
  }
})

export default router
