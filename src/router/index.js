import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'
import MainLayout from '@/layout/MainLayout.vue'

import SettingRouter from './modules/setting'
import ContactRouter from './modules/contact'
import AuthRouter from './modules/auth'

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
        component: () => import('@/views/example/index.vue')
      },
      SettingRouter,
      ContactRouter
    ]
  },
  AuthRouter,
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
  if (to.meta?.auth && !isLoggedIn()) {
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
