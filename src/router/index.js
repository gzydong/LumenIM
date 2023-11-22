import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'
import MainLayout from '@/layout/MainLayout.vue'
import SettingRouter from './modules/setting'
import ContactRouter from './modules/contact'
import AuthRouter from './modules/auth'
import Home from '@/views/index/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true },
    component: MainLayout,
    redirect: '/message',
    children: [
      {
        path: '/message',
        name: 'message',
        meta: { requiresAuth: true },
        component: () => import('@/views/index/index.vue')
      },
      {
        path: '/note',
        name: 'note',
        meta: { requiresAuth: true },
        component: () => import('@/views/note/index.vue')
      },
      {
        path: '/example',
        name: 'example',
        component: () => import('@/views/example/example.vue')
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
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置中间件，权限验证
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
