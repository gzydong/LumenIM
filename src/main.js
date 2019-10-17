import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
import { Notification } from 'element-ui';
import auth from './utils/auth.js'


import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/common.css'
import '../src/assets/iconfont/iconfont.css'




Vue.prototype.$notify = Notification;

Vue.use(VueResource)


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 如果有token 说明该用户已登陆
  if (auth.checkLogin()) {
      // 在已登陆的情况下访问登陆页会重定向到首页
      if (to.path === '/login') {
          next({path: '/'})
      } else {
          next()
      }
  } else {
      // 没有登陆则访问任何页面都重定向到登陆页
      if (to.path === '/login') {
        next()
    } else {
        next({path: '/login'})
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
