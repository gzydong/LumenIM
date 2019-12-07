/*eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login'),
      meta: {
        title: 'Lumen IM 聊天室',
        needLogin: false
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home'),
      meta: {
        title: 'Lumen IM 聊天室',
        needLogin: true
      },
    }
  ],
  mode: "history"
})
