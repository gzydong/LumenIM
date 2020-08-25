"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("babel-polyfill");

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("@/App"));

var _store = _interopRequireDefault(require("@/store"));

var _router = _interopRequireDefault(require("@/router"));

require("@/icons");

require("@/permission");

require("@/directives/directives");

require("@/plugins/element-ui");

var _wsSocket = _interopRequireDefault(require("@/plugins/socket/ws-socket"));

var _socketResourceHandle = _interopRequireDefault(require("@/plugins/socket/socket-resource-handle"));

require("@static/css/im-base.css");

var _auth = require("@/utils/auth");

var _user = require("@/api/user");

var _semver = require("semver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//引出全部指令
// 全局引入按需引入UI库 Element UI
// 全局引入自定义的WebSocket 插件
// 引入WebSocket消息处理类
// 引入自定义全局css
_vue["default"].config.productionTip = false;
var VueApp = new _vue["default"]({
  el: '#app',
  router: _router["default"],
  store: _store["default"],
  components: {
    App: _App["default"]
  },
  template: '<App ref="view" />',
  data: {
    // WsSocket对象 
    socket: null,
    //当前正在对话的用户数据
    message: {
      avatar: '',
      source: 0,
      receiveId: 0,
      records: [],
      index_name: ''
    }
  },
  created: function created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.initialize();
    }
  },
  methods: {
    // 页面初始化设置
    initialize: function initialize() {
      this.loadWebsocket();
      this.loadUserSetting();
    },
    // 连接websocket服务器
    loadWebsocket: function loadWebsocket() {
      var app = this,
          store = this.$store;
      this.socket = new _wsSocket["default"](process.env.WEB_SOCKET_URL, {
        // Websocket 连接失败回调方法
        onError: function onError(evt) {
          console.log('Websocket 连接失败回调方法');
        },
        // Websocket 连接成功回调方法
        onOpen: function onOpen(evt) {
          store.commit('UPDATE_SOCKET_STATUS', true);
        },
        // Websocket 断开连接回调方法
        onClose: function onClose(evt) {
          store.commit('UPDATE_SOCKET_STATUS', false);
        },
        // Websocket 接收消息回调方法
        onMessage: function onMessage(evt, event, data) {
          new _socketResourceHandle["default"]({
            event: event,
            data: data
          });
        }
      }, _auth.getToken);
      this.socket.initWebSocket();
    },
    // 更新当前正在对话的用户数据
    updateMessage: function updateMessage(source, receive_id) {
      var avatar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      this.message.source = parseInt(source);
      this.message.receiveId = parseInt(receive_id);
      this.message.avatar = avatar;
      this.message.records = [];
      this.message.index_name = source + '_' + receive_id;
    },
    // 加载用户相关设置信息，更新本地缓存
    loadUserSetting: function loadUserSetting() {
      var _this = this;

      (0, _user.findUserSettingServ)().then(function (res) {
        if (res.code == 200) {
          var setting = res.data.setting;
          var userInfo = res.data.user_info;

          _this.$store.commit('UPDATE_USER_INFO', {
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
    dumpTalkPage: function dumpTalkPage(index_name) {
      sessionStorage.setItem("send_message_index_name", index_name);

      if (this.$route.path == '/message') {
        this.$refs.view.refreshView();
        return;
      }

      this.$router.push({
        path: "/message"
      });
    }
  }
}); // 导出应用实例(其它js文件中可直接读取vue应用)

var _default = VueApp;
exports["default"] = _default;