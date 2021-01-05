import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import App from '@/App';
import store from '@/store';
import router from '@/router';
import mixin from './main-mixin'

import './core/lazy_use';
import './core/filter';
import './core/directives';
import '@/permission';
import '@/icons';

// 引入自定义全局css
import '@/assets/css/im-base.css';
import './global.less'; // 预留

Vue.config.productionTip = false;

let VueApp = new Vue({
  router,
  store,
  mixins: [mixin],
  render: h => h(App)
}).$mount('#app');

export default VueApp;