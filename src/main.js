// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'
import {server} from './request/http.js'
import VueResource from 'vue-resource'

import '../static/css/common.css'
import '../src/assets/iconfont/iconfont.css'

import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$notify = Notification;
Vue.use(VueResource)




router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
});



Vue.prototype.$server = server;
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
