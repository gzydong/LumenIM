// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'
import {server} from './request/http.js'
import VueResource from 'vue-resource'

import '../static/css/common.css'
import '../src/assets/iconfont/iconfont.css'

import wxLeft from './components/Left.vue'
import wxFixed from './components/Fixed.vue'

Vue.component('wxLeft', wxLeft)
Vue.component('wxFixed', wxFixed)



Vue.use(VueResource)

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
