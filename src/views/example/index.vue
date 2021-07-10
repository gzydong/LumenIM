<template>
  <div class="test">
    <!-- <NewMessageNotify /> -->
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
      message: this.$createElement(FriendApplyNotify, {
        props: {
          someProp: 'foobar',
        },
      }),
      customClass: 'im-notify',
      duration: 300000,
      position: 'top-right',
    })

    this.$openUserCard()
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
