<template>
  <div id="group-panel-page">
    <lumen-layout-panel :subarea="true">
      <template v-slot:lcolumn>
        <lumen-search @search-change="searchChange" placeholder="搜索群名称" @click-open="isLaunchGroupChat = true"></lumen-search>
        <div class="lumen-chat-sidebar lumen-scrollbar">
          <lumen-chat-list @lumen-click="lumenClick" v-for="(item,idx) in groups" :key="idx" :idx="idx" :img="item.avatarurl"
            :name="item.group_name" :content="'@'+item.group_profile" :active="idx == index?true:false" :params="item" :disturb='item.not_disturb' ></lumen-chat-list>
        </div>
      </template>

      <template v-slot:rcolumn>
        <div v-show="groupId > 0" class="lumen-chat-group-box">
          <lumen-user-group @close="groupId = 0;index = null" :group-id="groupId" @sendGroup="sendMessage" @quitGroup="quitGroupSuccess"></lumen-user-group>
        </div>
        <lumen-amicable v-show="groupId == 0"></lumen-amicable>
      </template>
    </lumen-layout-panel>

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="isLaunchGroupChat" @close="isLaunchGroupChat = false" @create-success="launchGroupChatSuccess"></launch-group-chat>
  </div>
</template>

<script>
  import {
    userGroups
  } from '@/services/api';

  import LumenLayoutPanel from '@/components/layout/LumenLayoutPanel';
  import LumenSearch from '@/components/layout/LumenSearch';
  import LumenChatList from '@/components/layout/LumenChatList';
  import LumenAmicable from '@/components/layout/LumenAmicable';
  import LumenUserGroup from '@/components/layout/LumenUserGroup';
  import LaunchGroupChat from '@/components/LaunchGroupChat';

  export default {
    name: "group-panel-page",
    components: {
      LumenLayoutPanel,
      LumenSearch,
      LumenChatList,
      LumenAmicable,
      LumenUserGroup,
      LaunchGroupChat
    },
    created() {
      this.loadUserGroups();
    },
    data() {
      return {
        index: null,
        groupId: 0,

        //用户群聊列表
        groups: [],

        //创建群聊窗口是否显示
        isLaunchGroupChat: false
      }
    },
    methods: {
      // 列表点击事件
      lumenClick(data) {
        this.index = data.idx;
        this.groupId = data.object.id;
      },

      //搜索框修改触发事件
      searchChange(value) {
        alert('功能正在研发中请耐心等待...');
      },

      //获取用户群聊列表接口
      loadUserGroups() {
        let that = this;
        this.index = null;
        this.groupId = 0;
        userGroups().then(res => {
          if (res.code == 200) {
            that.groups = res.data;
          }
        });
      },

      //创建群聊成功后的回调事件
      launchGroupChatSuccess() {
        this.isLaunchGroupChat = false;
        this.loadUserGroups();
      },

      //群聊窗口点击发送群聊信息按钮回调事件
      sendMessage(groupInfo) {
        this.index = null;
        this.groupId = 0;

        let index_name = `2_${groupInfo.groupId}`;
        this.$store.commit('updateNavModule', 0);
        let index = this.$parent.$refs.refDialoguePage.getIndex(index_name);
        if (index >= 0) {
          this.$parent.$refs.refDialoguePage.clickTab(2, index_name);
          return;
        }

        this.$parent.$refs.refDialoguePage.clickTab(1, {
          type: 2,
          friend_id: 0,
          group_id: groupInfo.groupId,
          index_name: index_name,
          avatar: groupInfo.avatar,
          name: groupInfo.groupName,
        });
      },

      //用户退出群聊回调事件
      quitGroupSuccess() {
        this.index = null;
        this.groupId = 0;
        this.loadUserGroups();
      }
    }
  };
</script>

<style scoped>
  #group-panel-page {
    width: 100%;
    height: 100%;
  }

  #group-panel-page .lumen-chat-sidebar {
    height: calc(100% - 60px);
    height: -moz-calc(100% - 60px);
    height: -webkit-calc(100% - 60px);
    background: #e4e4e5;
    overflow-x: hidden;
    overflow-y: auto;
  }

  @keyframes showBox {
    0% {
      transform: translateX(600px)
    }

    to {
      transform: translateX(0)
    }
  }

  @-webkit-keyframes showBox {
    0% {
      -webkit-transform: translateX(600px)
    }

    to {
      -webkit-transform: translateX(0)
    }
  }

  .lumen-chat-group-box {
    position: absolute;
    width: 350px;
    height: 100%;
    right: 0;
    z-index: 2;
    animation: showBox .5s ease-in-out;
    -webkit-animation: showBox .5s ease-in-out;
    -moz-animation: showBox .5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
  }
</style>
