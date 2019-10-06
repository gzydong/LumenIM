/*eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Left from '@/components/Left'
import {Tab,Tabs } from 'vant';
Vue.use(Tab).use(Tabs);

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Left',
      component: Left,
    },

  ]
})
