import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
    path: '/',
    name: 'home',
    component: () => import('@/views/MessagePage'),
    meta: {
      title: '',
      needLogin: true
    }
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/MessagePage'),
    meta: {
      title: '消息通知',
      needLogin: true
    }
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('@/views/FriendsPage'),
    meta: {
      title: '我的好友',
      needLogin: true
    }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/NotePage'),
    meta: {
      title: '我的笔记',
      needLogin: true
    }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: () => import('@/views/SchedulePage'),
    meta: {
      title: '日程安排',
      needLogin: true
    }
  },

  // 授权相关
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/NewLogin'),
    meta: {
      title: '登录',
      needLogin: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/NewRegister'),
    meta: {
      title: '账号注册',
      needLogin: false
    }
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/auth/NewForgetPassword'),
    meta: {
      title: '找回密码',
      needLogin: false
    }
  },
  {
    path: '*',
    name: '404 NotFound',
    component: () => import('@/views/auth/NotFoundPage'),
    meta: {
      title: '404 NotFound',
      needLogin: false
    }
  },

  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestPage'),
    meta: {
      title: '404 NotFound',
      needLogin: false
    }
  },
];


export default new Router({
  routes,
  mode: "history"
});