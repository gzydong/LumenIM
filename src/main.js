import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import MainMixin from './mixins/main-mixin'

import './core/lazy-use'
import './core/global-component'
import './core/filter'
import './core/directives'
import '@/permission'
import '@/icons'

// 引入自定义全局css
import '@/assets/css/global.less'

Vue.config.productionTip = false

const Instance = new Vue({
  router,
  store,
  mixins: [MainMixin],
  render: h => h(App),
}).$mount('#app')

export default Instance
