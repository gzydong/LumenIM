<template id="luem-chat-tpl">
  <div>
    <div class="luem-chat-list" :class="{'luem-chat-active':active}" @click="luemClick()">
      <img :src="img" :onerror="$store.state.user.detaultAvatar">
      <span  class="notify-unread-num" v-show="unreadNum"  v-text="unreadNum"></span>
      <div class="luem-chat-right">
        <p class="luem-chat-title">
          <span class="luem-chat-name">{{nickname?nickname:name}}</span>
          <span class="luem-chat-time">{{time?time:''}}</span>
        </p>
        <p class="luem-chat-content" v-html="content" ></p>
      </div>
    </div>
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
      params: Object,
      unreadNum:{
        type:[String, Number],
        default:0
      }
    },
    methods: {
      luemClick() {
        this.$emit('lumen-click', {
          idx: this.idx,
          img: this.img,
          name: this.name,
          nickname: this.nickname,
          time: this.time,
          content: this.content,
          object: this.params || {}
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
    background: #e4e4e5;
    padding: 12px 0;
    cursor: pointer;
    border-bottom: 1px solid #e3d9d9;
  }

  .luem-chat-list:hover,
  .luem-chat-active {
    background-color: #DDDBDB;
  }

  .luem-chat-list img {
    width: 40px;
    height: 40px;
    float: left;
    border-radius: 3px;
    margin-left: 10px;
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
    float: left;
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
    margin-right: 5px;
    font-size: 13px;
    color: #a1a1a1;
  }

  .luem-chat-list .luem-chat-content {
    width: 90%;
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
</style>
