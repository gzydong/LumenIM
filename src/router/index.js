/*eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import dialogue from '@/components/Dialogue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: 'IM 聊天室 - 登录页面'
      }
    },
    {
      path: '/dialogue',
      name: 'dialogue',
      component: dialogue,
      meta: {
        title: 'IM 聊天室'
      }
    },

  ],
  mode: "history"
})
