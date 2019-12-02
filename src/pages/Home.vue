<template>
  <div id="lumen-dialogue-panel">
    <div class="dialogue-panel-body">
      <!-- 菜单导航栏 -->
      <div class="lumen-sidebar-nav">
        <div class="lumen-sidebar-menu">
          <ul>
            <li>
              <img :src="$store.state.user.avatar" class="lumen-user-avatar" :onerror="$store.state.user.detaultAvatar"
                @click="showBox('showUserSetupBox')" />
            </li>

            <li @click="activeNavMenu(0)" v-bind:class="{ activeModuleClass: $store.getters.navModule == 0?true:false }">
              <i class="iconfont icon-duanxin"><span class="i-hotspot" v-show="$store.getters.unreadNum"></span></i>
            </li>

            <li @click="activeNavMenu(1)" v-bind:class="{ activeModuleClass: $store.getters.navModule == 1?true:false }">
              <i class="iconfont icon-tongxunlu"><span class="i-hotspot" v-show="$store.getters.applyUnreadNum"></span></i>
            </li>

            <li @click="activeNavMenu(2)" v-bind:class="{ activeModuleClass: $store.getters.navModule == 2?true:false }">
              <i class="iconfont icon-qunzu"></i>
            </li>
          </ul>

          <i class="iconfont icon-caidan1 lumen-menu-setup" @click="setupToolbar = !setupToolbar"></i>
        </div>

        <!-- 工具栏 -->
        <ul class="lumen-panel-setup" v-show="setupToolbar">
          <li @click="showBox('showUserSetupBox')">个人信息</li>
          <li @click="showBox('showPasswordBox')">密码修改</li>
          <li @click="showBox('showSeekFriendBox')">添加好友</li>
          <li @click="showBox('showlaunchGroupChatBox')">创建群聊</li>
          <li @click="logout">退出登录</li>
        </ul>
      </div>

      <!-- 右侧主体- 消息通知子模块  -->
      <div class="lumen-page-container" v-show="$store.getters.navModule == 0">
        <chat-dialogue-page ref="refDialoguePage"></chat-dialogue-page>
      </div>

      <div class="lumen-page-container" v-show="$store.getters.navModule == 1">
        <fridens-panel-page ref="refFridensPage"></fridens-panel-page>
      </div>

      <div class="lumen-page-container" v-show="$store.getters.navModule == 2">
        <group-panel-page ref="refGroupPage"></group-panel-page>
      </div>
    </div>

    <!-- 修改密码组件 -->
    <change-password v-if="$store.state.dialogue.subgroup.pwdIsOpen"></change-password>

    <!-- 用户信息设置组件 -->
    <user-setup v-if="$store.state.dialogue.subgroup.userSetupIsOpen"></user-setup>

    <!-- 添加、查找好友组件 -->
    <seek-friend v-if="$store.state.dialogue.subgroup.seekFriendIsOpen"></seek-friend>
  </div>
</template>

<style scoped src="@static/css/home.css"></style>
<script>
  //为单独路由设置背景图片
  document.querySelector('body').setAttribute('style',
    "background:url('//res.wx.qq.com/a/wx_fed/webwx/res/static/img/2zrdI1g.jpg') no-repeat;background-size: 100% 100%;"
  )

  import WsSocket from '@/utils/WsSocket';
  import auth from '@/utils/auth';

  //修改密码组件
  import ChangePassword from '@/components/ChangePassword';

  //用户信息设置组件
  import UserSetup from '@/components/UserSetup';

  //用户搜索组件
  import SeekFriend from '@/components/SeekFriend';

  import ChatDialoguePage from '@/pages/ChatDialoguePage';
  import FridensPanelPage from '@/pages/FridensPanelPage';
  import GroupPanelPage from '@/pages/GroupPanelPage';

  var newMessageRemind = {
    _step: 0,
    _title: document.title,
    _timer: null,
    //显示新消息提示
    show: function() {
      var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
      newMessageRemind._timer = setTimeout(function() {
        newMessageRemind.show();
        //这里写Cookie操作
        newMessageRemind._step++;
        if (newMessageRemind._step == 3) {
          newMessageRemind._step = 1
        };
        if (newMessageRemind._step == 1) {
          document.title = "【　　　】" + temps
        };
        if (newMessageRemind._step == 2) {
          document.title = "【新消息】" + temps
        };
      }, 800);
      return [newMessageRemind._timer, newMessageRemind._title];
    },
    //取消新消息提示
    clear: function() {
      clearTimeout(newMessageRemind._timer);
      document.title = newMessageRemind._title;
      //这里写Cookie操作
    }
  };


  export default {
    name: "lumen-dialogue-panel",
    components: {
      ChangePassword,
      UserSetup,
      SeekFriend,
      ChatDialoguePage,
      FridensPanelPage,
      GroupPanelPage
    },
    computed: {
      unreadNum() {
        return this.$store.getters.unreadNum;
      }
    },
    watch: {
      unreadNum(newValue, oldValue) {
        if (newValue == 0) {
          newMessageRemind.clear();
        } else {
          newMessageRemind.show();
        }
      }
    },
    data() {
      return {
        // 工具栏是否显示
        setupToolbar: false,

        //WsSocket
        wsSocketObj: null,
      }
    },
    created() {
      this.loadWebsocket();

      //异步获取用户相关数据
      this.$store.dispatch('asyncServer');

      // newMessageRemind.show();
    },
    methods: {
      //左菜单点击事件
      activeNavMenu(idx) {
        this.$store.commit('updateNavModule', idx);
      },

      //显示窗口方法
      showBox(boxName) {
        this.setupToolbar = false;
        this.$store.commit(boxName, true);
      },

      // 退出登录
      logout() {
        let that = this;
        this.wsSocketObj.wsConnect.close(4031, '用户退出登录');
        setTimeout(function() {
          that.$store.dispatch('logout', this.$router);
        }, 500);
      },

      //加载Websocket
      loadWebsocket() {
        this.wsSocketObj = new WsSocket(this.$store.state.user.sid, {
          //Websocket 连接失败回调方法
          onError: (evt) => {},
          //Websocket 连接成功回调方法
          onOpen: (evt) => {},
          //Websocket 断开连接回调方法
          onClose: (evt) => {
            if (evt.code == 4030) {
              this.$store.dispatch('logout', this.$router);
            }
          },
          //Websocket 接收消息回调方法
          onMessage: this.onMessage,
        });

        this.wsSocketObj.initWebSocket();
      },

      //Websocket 接收消息回调方法
      onMessage(evt, evtName, message) {
        switch (evtName) {
          case 'notify':
            this.$notify({
              message: message.textMessage,
              position: 'top-right'
            });
            break;
          case 'chat_message':
            this.$refs.refDialoguePage.syncMessage(message, this.activeModule);
            break;
          case 'join_group':
            this.$notify({
              message: `您已成功加入[${message.group_name}]聊天群...`,
              position: 'top-right'
            });

            break;
          case 'friend_apply':
            this.$notify({
              message: `您有新的好友申请，请尽快处理...`,
              position: 'top-right'
            });

            this.$store.commit('setFriendApplyNum', 'incr');
            break;
        }
      },

      supported() {
        if (window.webkitNotifications) {
          alert('浏览器支持Notifications');
        } else {
          alert('浏览器不支持Notifications');
        }
      }
    }
  };
</script>
