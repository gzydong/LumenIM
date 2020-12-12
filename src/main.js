import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import App from '@/App';
import store from '@/store';
import router from '@/router';
import config from '@/config/config'

import './core/lazy_use';
import './core/filter';
import './core/directives';
import '@/permission';
import '@/icons';

// 全局引入自定义的WebSocket 插件
import WsSocket from '@/plugins/socket/ws-socket';

// 引入WebSocket消息处理类
import SocketResourceHandle from '@/plugins/socket/socket-resource-handle';

// 引入自定义全局css
import '@/assets/css/im-base.css';
import '@/global.less';

Vue.config.productionTip = false;

import {
  getToken
} from '@/utils/auth';

import {
  ServeFindUserSetting
} from "@/api/user";

let VueApp = new Vue({
  router,
  store,
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
    },
  },
  created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.initialize();
    }
  },
  methods: {
    // 页面初始化设置
    initialize() {
      this.loadWebsocket();
      this.loadUserSetting();
    },

    // 连接websocket服务器
    loadWebsocket() {
      let store = this.$store;
      this.socket = new WsSocket(config.ws_url, {
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

    // 加载用户相关设置信息，更新本地缓存
    loadUserSetting() {
      ServeFindUserSetting().then(res => {
        if (res.code == 200) {
          let setting = res.data.setting;
          let userInfo = res.data.user_info;

          this.$store.commit('UPDATE_USER_INFO', {
            uid: userInfo.uid,
            nickname: userInfo.nickname,
            sex: userInfo.gender,
            signature: userInfo.motto,
            avatar: userInfo.avatar
          });
        }
      });
    },

    // 跳转到指定好友对话页
    dumpTalkPage(index_name) {
      sessionStorage.setItem("send_message_index_name", index_name);

      if (this.$route.path == '/message') {
        this.$root.$children[0].refreshView();
        return;
      }

      this.$router.push('/message');
    }
  },
  render: h => h(App)
}).$mount('#app');

// 导出应用实例(其它js文件中可直接读取vue应用)
export default VueApp;
