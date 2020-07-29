<template>
  <div class="luem-chat-list" :class="{'luem-chat-active':active,'item-top':isTop}" @click="luemClick"
    @contextmenu.prevent="onContextmenu($event,idx)">
    <div v-if="img" class="no-user-select"><img class="avatar-img" :src="img" :onerror="$store.state.user.detaultAvatar" /></div>
    <div v-else class="avatar-text no-user-select">{{(nickname?nickname:name).substr(0,1)}}</div>
    <span class="notify-unread-num" v-show="unreadNum" v-text="unreadNum"></span>
    <div class="luem-chat-right">
      <p class="luem-chat-title">
        <span class="luem-chat-name">{{nickname?nickname:name}}</span>
        <span class="luem-chat-time no-user-select">{{time?time:''}}</span>
      </p>
      <p class="luem-chat-content" v-html="content"></p>
    </div>
    <i v-show="disturb" class="iconfont icon-xiaoximiandarao miandarao"></i>
  </div>
</template>

<script>
  export default {
    name: "luem-chat-tpl",
    props: {
      idx: Number,
      img: String,
      name: [String, Number],
      nickname: [String, Number],
      time: String,
      content: [String, Number],
      active: Boolean,
      isTop: Boolean,
      params: Object,
      unreadNum: {
        type: [String, Number],
        default: 0
      },
      disturb: {
        type: [String, Number],
        default: 0
      }
    },
    mounted() {},
    methods: {
      luemClick() {
        this.$emit("lumen-click", {
          idx: this.idx,
          img: this.img,
          name: this.name,
          nickname: this.nickname,
          time: this.time,
          content: this.content,
          object: this.params || {}
        });
      },
      onContextmenu(event, idx) {
        this.$emit("on-contextmenu", {
          event,
          idx,
          item: this.params
        });
      }
    }
  };

</script>

<style scoped>
  .notify-unread-num {
    display: inline-block;
    background: rgb(253, 0, 0);
    border-radius: 50%;
    color: rgb(255, 236, 236);
    font-size: 10px;
    position: absolute;
    left: 43px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    max-width: 19px;
    min-width: 15px;
    top: 6px;
  }

  .luem-chat-list {
    position: relative;
    height: 40px;
    width: 100%;
    background-color: #e4e4e5;
    padding: 12px 0;
    cursor: pointer;
    border-bottom: 1px solid #e3d9d9;
  }

  .item-top:before {
    content: "";
    display: inline-block;
    position: absolute;
    left: 2px;
    top: 2px;
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-width: 12px 12px 0 0;
    border-color: #5ec9f6 transparent transparent;
  }


  .luem-chat-list:hover,
  .luem-chat-active {
    background-color: #dddbdb;
  }

  .luem-chat-list .avatar-img {
    width: 40px;
    height: 40px;
    float: left;
    border-radius: 20px;
    margin-left: 10px;
  }

  .luem-chat-list .avatar-text {
    width: 40px;
    height: 40px;
    float: left;
    border-radius: 20px;
    margin-left: 10px;
    background: #8f8ff5;
    text-align: center;
    line-height: 40px;
    color: white;
  }

  .luem-chat-list .avatar-img:hover,
  .luem-chat-list .avatar-text:hover {
    border-radius: 5px;
    transition-duration: .5s;
  }

  .luem-chat-right {
    float: left;
    width: calc(100% - 50px);
    width: -moz-calc(100% - 50px);
    width: -webkit-calc(100% - 50px);
  }

  .luem-chat-list .luem-chat-title {
    height: 22px;
    width: 100%;
    line-height: 22px;
    font-size: 14px;
    display: inline-block;
    overflow: hidden;
  }

  .luem-chat-list .luem-chat-title .luem-chat-name {
    width: calc(100% - 90px);
    width: -moz-calc(100% - 90px);
    width: -webkit-calc(100% - 90px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    text-indent: 10px;
  }

  .luem-chat-list .luem-chat-title .luem-chat-time {
    width: 75px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    float: right;
    text-align: right;
    margin-right: 13px;
    font-size: 13px;
    color: #a1a1a1;
  }

  .luem-chat-list .luem-chat-content {
    width: 85%;
    height: 20px;
    line-height: 14px;
    text-indent: 10px;
    font-size: 10px;
    color: #a1a1a1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 15px;
  }

  .miandarao {
    position: absolute;
    right: 5px;
    bottom: 10px;
    font-size: 12px;
    color: #c0c0c7;
  }

</style>
