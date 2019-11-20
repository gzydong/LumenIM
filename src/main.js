import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
import store from './store/store'
import auth from './utils/auth'

import { Notification,Loading,MessageBox,Popover} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/common.css'



Vue.use(Popover);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(VueResource)

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 如果有token 说明该用户已登陆
  if (auth.getTokenExpiresin() > 0) {
    if (to.path === '/login') {// 在已登陆的情况下访问登陆页会重定向到首页
        next({path: '/'});
    }else{
      next();
    }
  } else {
    if (to.path == '/login') {// 没有登陆则访问任何页面都重定向到登陆页
       next();
    }else{
       next({path: '/login'});
    }
  }
})

Vue.config.productionTip = false



//自定义聚焦指令 和自定义过滤器一样,我们这里定义的是全局指令
Vue.directive('focus',{
  inserted(el) {
    el.focus()
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created(){
    this.$store.dispatch('syncUserInfo');
  }
})
