import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import App from '@/App';
import store from '@/store';
import router from '@/router';
import mixin from './main-mixin'

import './core/lazy-use';
import './core/global-component';
import './core/filter';
import './core/directives';
import '@/permission';
import '@/icons';

// 引入自定义全局css
import '@/assets/css/global.less';

Vue.config.productionTip = false;

let VueApp = new Vue({
  router,
  store,
  mixins: [mixin],
  render: h => h(App)
}).$mount('#app');

export default VueApp;