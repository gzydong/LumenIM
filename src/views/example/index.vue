<template>
  <div class="test">
    <!-- <NewMessageNotify /> -->

    <visit-card-message/>
  </div>
</template>

<script>
import FriendApplyMessage from '@/components/chat/messaege/FriendApplyMessage'
import NewMessageNotify from '@/components/notify/NewMessageNotify'
import FriendApplyNotify from '@/components/notify/FriendApplyNotify'
import Vue from 'vue'
export default {
  components: { FriendApplyMessage, NewMessageNotify, FriendApplyNotify },
  data() {
    return {}
  },
  methods: {},
  created() {
    this.$notify({
      message: this.$createElement(NewMessageNotify, {
        props: {
          // avatar: '',
          talk_type: 1,
          nickname: '那金卡仕达111',
          content: '那数据库的纳斯达克你卡视角那你水晶蓝驾考那我呢卡莎那就看',
          datetime: '2020-06-08 12:12:12',
        },
      }),
      customClass: 'im-notify',
      duration: 300000,
      position: 'top-right',
    })
  },
}
</script>
<style lang="less" scoped>
.test {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
