/*eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import Home from '@/pages/Home'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: 'Lumen IM 聊天室'
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Lumen IM 聊天室'
      }
    }
  ],
  mode: "history"
})
