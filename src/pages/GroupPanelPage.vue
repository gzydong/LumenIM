<template>
  <div id="group-panel-page">
    <lumen-layout-panel :subarea="true">
      <template v-slot:lcolumn>
        <lumen-search @search-change="searchChange" placeholder="搜索群名称" @click-open="isLaunchGroupChat = true"></lumen-search>
        <div class="lumen-chat-sidebar lumen-scrollbar">
          <lumen-chat-list @lumen-click="lumenClick" v-for="(item,idx) in list" :key="idx" :idx="idx" :img="item.avatarurl"
            :name="item.group_name" :content="'简介: '+item.group_profile" :active="idx == index?true:false" :params="item"></lumen-chat-list>
        </div>
      </template>

      <template v-slot:rcolumn>
        <div v-show="groupId > 0" class="lumen-chat-group-box">
          <lumen-user-group @close="groupId = 0" :group-id="groupId" @send="sendMessage"></lumen-user-group>
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
    userGroups,
    crateChatListApi
  } from '@/services/api';

  import {
    dateFormat
  } from '@/utils/functions'

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
        list: [],
        isLaunchGroupChat: false
      }
    },
    methods: {
      // 列表点击事件
      lumenClick(data) {
        this.idx = data.idx;
        this.groupId = data.object.id;
      },

      //搜索框修改触发事件
      searchChange(value) {
        alert('功能正在研发中请耐心等待...');
      },

      //获取群聊列表接口
      loadUserGroups() {
        let that = this;
        userGroups().then(res => {
          if (res.code == 200) {
            that.list = res.data;
          }
        });
      },

      launchGroupChatSuccess() {
        this.isLaunchGroupChat = false;
        this.loadUserGroups();
      },


      // 获取聊天列表数组索引
      getChatListIdx(index_name) {
        let list = this.$store.state.dialogue.chatModule.chatList;
        for (let i in list) {
          if (list[i].index_name == index_name) {
            return i;
          }
        }
        return -1;
      },
      sendMessage(groupInfo) {
        let index_name = `2_${groupInfo.groupId}`;
        let idx = this.getChatListIdx(index_name);

        if (idx < 0) {
          //创建聊天列表
          crateChatListApi({
            receive_id: groupInfo.groupId,
            type: 2
          });
          this.$store.commit('updateChatList', {
            type: 4,
            message: {
              type: 2,
              group_id: groupInfo.groupId,
              friend_id: 0,
              index_name: index_name,
              avatar: groupInfo.avatar,
              name: groupInfo.groupName,
              nickname: '',
              unread_num: 0,
              msg_text: '...',
              created_at: dateFormat('YYYY/mm/dd HH:MM:SS',new Date())
            }
          });
        }

        this.$store.commit('updateNavModule', 0);
        this.$store.commit('func', {
          idx: index_name,
          minRecordId: 0,
          cahtRecords: []
        });
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
