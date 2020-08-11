import 'babel-polyfill';
import Vue from 'vue';
import App from '@/App';
import store from '@/store';
import router from '@/router';
import '@/icons';
import '@/permission';
import '@/directives/directives'; //引出全部指令

// 全局引入按需引入UI库 Element UI
import '@/plugins/element-ui';

// 全局引入自定义的WebSocket 插件
import WsSocket from '@/plugins/socket/ws-socket';

// 引入WebSocket消息处理类
import SocketResourceHandle from '@/plugins/socket/socket-resource-handle';

// 引入自定义全局css
import '@static/css/im-base.css';

Vue.config.productionTip = false;

import {
  getToken
} from '@/utils/auth';


let VueApp = new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  data: {
    // WsSocket对象 
    socket: null,

    //当前正在对话的用户数据
    message: {
      avatar: '',
      source: 0,
      receiveId: 0,
      records: [],
      index_name: '',
    }
  },
  created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.loadWebsocket();
      this.loadUserSetting();
    }
  },
  methods: {
    // 连接websocket服务器
    loadWebsocket() {
      let app = this,
        store = this.$store;
      this.socket = new WsSocket(process.env.WEB_SOCKET_URL, {
        // Websocket 连接失败回调方法
        onError: (evt) => {
          console.log('Websocket 连接失败回调方法')
        },
        // Websocket 连接成功回调方法
        onOpen: (evt) => {
          store.commit('UPDATE_SOCKET_STATUS', true);
        },
        // Websocket 断开连接回调方法
        onClose: (evt) => {
          store.commit('UPDATE_SOCKET_STATUS', false);
        },
        // Websocket 接收消息回调方法
        onMessage(evt, event, data) {
          new SocketResourceHandle({
            event,
            data
          });
        }
      }, getToken);

      this.socket.initWebSocket();
    },

    // 更新当前正在对话的用户数据
    updateMessage(source, receive_id, avatar = '') {
      this.message.source = parseInt(source);
      this.message.receiveId = parseInt(receive_id);
      this.message.avatar = avatar;
      this.message.records = [];
      this.message.index_name = source + '_' + receive_id;
    },

    // 加载用户相关设置信息
    loadUserSetting() {
      console.log('加载用户设置...');
    }
  }
});

// 导出应用实例(其它js文件中可直接读取vue应用)
export default VueApp;
