import Vue from 'vue'
import Router from 'vue-router'
import AuthRouter from './auth'
import SettingRouter from './settings'
import ContactsRouter from './contacts'

Vue.use(Router)

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view'),
}

const routes = [
  AuthRouter,
  SettingRouter,
  ContactsRouter,
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/message/index'),
    meta: {
      title: '',
      needLogin: true,
    },
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/index'),
    meta: {
      title: '消息通知',
      needLogin: true,
    },
  },
  {
    path: '/note',
    name: 'note',
    component: () => import('@/views/note/index'),
    meta: {
      title: '我的笔记',
      needLogin: true,
    },
  },
  {
    path: '/example',
    name: 'example',
    component: () => import('@/views/example/index'),
    meta: {
      title: '测试案例',
      needLogin: false,
    },
  },
  {
    path: '*',
    name: '404 NotFound',
    component: () => import('@/views/other/404'),
    meta: {
      title: '404 NotFound',
      needLogin: false,
    },
  },
]

export default new Router({
  routes,
  mode: 'history',
})
