/*eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import dialogue from '@/pages/Dialogue'
import Home from '@/pages/Home'
import TestPage from '@/pages/Test'

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
      path: '/dialogue',
      name: 'dialogue',
      component: dialogue,
      meta: {
        title: 'Lumen IM 聊天室'
      }
    }, {
      path: '/test',
      name: 'test',
      component: TestPage,
      meta: {
        title: 'Lumen IM 测试页面'
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
