<template>
  <div id="fridens-panel-page">
    <lumen-layout-panel :subarea="true">
      <template v-slot:lcolumn>
        <lumen-search @search-change="searchChange" placeholder="搜索我的好友" @click-open="open"></lumen-search>
        <div class="friends-notify" @click="loadFriendApply">
          <div class="cus-tubiao">
            <i class="iconfont icon-jurassic_add-users"></i>
            <span class="appyle-hotspot" v-show="$store.getters.applyUnreadNum"></span>
          </div>
          <span>新的朋友<span v-show="$store.getters.applyUnreadNum">({{$store.getters.applyUnreadNum}})</span></span>
        </div>

        <div class="lumen-chat-sidebar lumen-scrollbar">
          <lumen-chat-list @lumen-click="lumenClick" v-for="(item,idx) in friends" :key="idx" :idx="idx" :img="item.avatarurl"
            :name="item.nickname" :content="setUserTip(item)" :nickname='item.friend_remark' :active="false" :params="item"></lumen-chat-list>
        </div>
      </template>

      <template v-slot:rcolumn>
        <lumen-amicable v-show="!isCatApply"></lumen-amicable>

        <header class="lumen-chat-header" v-show="isCatApply">
          <p>我的好友申请</p>
        </header>

        <main v-show="isCatApply" class="lumen-chat-main lumen-scrollbar">
          <div v-if="applyHandle.applyRecordList.length > 0" class="lumen-apply-box lumen-scrollbar">
            <div class="apply-container" v-for="(applyRecord,ridx) in applyHandle.applyRecordList">
              <img :src="applyRecord.avatarurl" :onerror="$store.state.user.detaultAvatar" @click="catFirendDetail(applyRecord.mobile)">
              <div class="name">
                <p>{{ applyRecord.nickname }}</p>
                <p><span class="apply-refuse-reason" :title="applyRecord.reason" v-show="applyRecord.reason">[拒绝原因]
                  </span>{{ applyRecord.remarks }}</p>
              </div>

              <div class="message success" v-if="applyRecord.status == 0">
                <span @click="selectHandleFriend(ridx,1,applyRecord)">接受</span>
                <span @click="selectHandleFriend(ridx,2,applyRecord)">拒绝</span>
              </div>

              <div class="message " v-else-if="applyRecord.status == 1">
                <span>已同意</span>
              </div>
              <div class="message " v-else>
                <span>已拒绝</span>
              </div>
            </div>

            <div v-show="applyHandle.isShow" class="apply-handle-from" v-bind:style="{top: applyHandle.top + 'px' }">
              <div>
                <span>{{applyHandle.type == 1?'好友备注':'拒绝原因'}}</span>：<input type="text" v-model="applyHandle.remark"
                  @keyup.enter="confirmHandleApply(1)">
              </div>
              <div class="handle-from-btn">
                <span @click="confirmHandleApply(1)">确定</span>
                <span @click="confirmHandleApply(2)">取消</span>
              </div>
            </div>
          </div>
          <div class="apply-list-empty" v-else>暂无好友申请</div>
        </main>
      </template>
    </lumen-layout-panel>

  </div>
</template>

<script>
  import {
    friendsApi,
    friendApplyRecords,
    handleFriendApplyApi
  } from '@/services/api'

  import LumenLayoutPanel from '@/components/layout/LumenLayoutPanel';
  import LumenSearch from '@/components/layout/LumenSearch';
  import LumenChatList from '@/components/layout/LumenChatList';
  import LumenAmicable from '@/components/layout/LumenAmicable';

  export default {
    name: "fridens-panel-page",
    components: {
      LumenLayoutPanel,
      LumenSearch,
      LumenChatList,
      LumenAmicable
    },
    created() {
      this.loadFriends();
    },
    data() {
      return {
        friends: [],

        //好友申请处理模块
        applyHandle: {
          applyRecordList: [],
          isShow: false,
          top: 0,
          apply_id: 0,
          type: 1,
          remark: '',
        },
        isCatApply: false
      }
    },
    methods: {
      //格式化好友签名
      setUserTip(firend) {
        let online = firend.online ? '<span style="color:#058205a3">[在线]</span>' : '[离线]';
        return `${online} - ${firend.motto}`;
      },

      // 列表点击事件
      lumenClick(data) {
        this.isCatApply = false;
        this.$store.commit('showSeekFriendBox', {
          type: 2,
          text: data.object.id
        });
      },

      //搜索框修改触发事件
      searchChange(value) {
        alert('功能正在研发中请耐心等待...');
      },

      //搜索框加号点击事件
      open() {
        this.$store.commit('showSeekFriendBox', true);
      },

      // 查看好友通讯录
      loadFriends() {
        let that = this
        friendsApi().then(res => {
          if (res.code == 200) {
            that.friends = res.data;
          }
        })
      },

      //查看好友申请列表
      loadFriendApply() {
        let that = this;
        this.isCatApply = true;
        friendApplyRecords().then(res => {
          if (res.code == 200) {
            that.applyHandle.applyRecordList = res.data.rows;
            that.$store.commit('setFriendApplyNum', 0);
          }
        });
      },

      //选择需要处理的好友申请，接受或者拒绝
      selectHandleFriend(ridx, type, data) {
        this.applyHandle.isShow = true;
        this.applyHandle.top = ridx * 65;
        this.applyHandle.type = type;
        this.applyHandle.apply_id = data.id;
        this.applyHandle.remark = (type == 1) ? data.nickname : '';
      },

      confirmHandleApply(type) {
        let that = this,
          fuc = () => {
            that.applyHandle.isShow = false;
            that.applyHandle.top = 0;
            that.applyHandle.type = 0;
            that.applyHandle.apply_id = 0
            that.applyHandle.remark = '';
          }
        if (type == 2) {
          fuc();
          return;
        }

        handleFriendApplyApi({
          type: that.applyHandle.type,
          apply_id: this.applyHandle.apply_id,
          remarks: this.applyHandle.remark
        }).then(res => {
          if (res.code == 200) {
            that.loadFriendApply();
            that.loadFriends();
            fuc();
          }
        });
      },

      //查看用户信息
      catFirendDetail(mobile) {
        this.$store.commit('showSeekFriendBox', {
          type: 1,
          text: mobile
        });
      }
    }
  };
</script>

<style scoped>
  #fridens-panel-page {
    width: 100%;
    height: 100%;
  }

  .lumen-chat-sidebar {
    height: calc(100% - 121px);
    height: -moz-calc(100% - 121px);
    height: -webkit-calc(100% - 121px);
    background: #e4e4e5;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .friends-notify {
    height: 50px;
    line-height: 50px;
    background: #e4e4e5;
    border-bottom: 1px solid #e3d9d9;
    padding: 5px 5px 5px 10px;
    cursor: pointer;
  }

  .friends-notify .cus-tubiao {
    height: 40px;
    width: 40px;
    display: inline-block;
    background: #e4a52b;
    text-align: center;
    line-height: 42px;
    color: #ffff;
    border-radius: 5px;
    position: relative;
  }

  .friends-notify span {
    padding-left: 5px;
  }

  .friends-notify .cus-tubiao .appyle-hotspot {
    width: 0px;
    height: 5px;
    background: #ff6060;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    left: 30px;
    top: 4px;
    line-height: 5px;
  }

  .lumen-chat-header {
    height: 60px;
    box-shadow: -1px 1px 20px #e8e3e3;
  }

  .lumen-chat-header p {
    height: 60px;
    line-height: 60px;
    text-indent: 10px;
  }

  .lumen-chat-main {
    height: calc(100% - 60px);
    height: -moz-calc(100% - 60px);
    height: -webkit-calc(100% - 60px);
    overflow-y: auto;
  }

  .lumen-apply-box {
    width: 95%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
  }

  .lumen-apply-box>.apply-container {
    border-bottom: 1px solid #eae4e4;
    padding: 10px;
    height: 45px;
  }

  .lumen-apply-box>.apply-container img {
    width: 45px;
    border-radius: 6px;
    height: 45px;
    float: left;
    cursor: pointer;
  }

  .apply-container .name {
    float: left;
    width: calc(100% - 180px);
    margin-left: 10px;
    font-size: 16px;
  }

  .apply-container .apply-refuse-reason {
    cursor: pointer;
    color: #32b6ea;
  }

  .apply-container .name p:first-child {
    height: 20px;
    line-height: 20px;
  }

  .apply-container .name p:last-child {
    font-size: 12px;
    color: #999999;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }

  .apply-container .message {
    float: right;
    line-height: 45px;
    font-size: 12px;
    color: #999999;
    margin-right: 10px;
  }

  .apply-container .success>span {
    padding: 3px 10px;
    line-height: 22px;
    background-color: #24ba39;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
  }

  .apply-container .success>span:last-child {
    background-color: #cccccc;
    margin-left: 6px;
  }

  .lumen-apply-box .apply-handle-from {
    height: 65px;
    line-height: 65px;
    width: 100%;
    background: #ffffff;
    position: absolute;
    box-shadow: 3px 3px 10px #d5d5d5;
  }

  .apply-handle-from div:nth-child(1) {
    float: left;
    margin-left: 13px;
  }

  .apply-handle-from div:nth-child(1) input {
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    padding: 3px 5px 3px 5px;
    border: 1px solid #ccc;
  }

  .apply-handle-from div:nth-child(2) {
    float: right;
    margin-right: 23px;
  }

  .apply-handle-from .handle-from-btn span {
    width: 45px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    margin-left: 8px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
  }

  .apply-handle-from .handle-from-btn span:nth-child(1) {
    background-color: #24ba39;
  }

  .apply-handle-from .handle-from-btn span:nth-child(2) {
    background-color: #CCCCCC;
  }

  .apply-list-empty {
    text-align: center;
    font-size: 26px;
    color: #dfdede;
    text-shadow: 5px 2px 6px #e4e4e4;
    font-family: "Times New Roman", Georgia, Serif;
    font-style: italic;
    margin-top: 50px;
  }
</style>
