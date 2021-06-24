<template>
  <div class="messaege">
    <!-- <FriendApplyMessage /> -->

    <div class="test">
      <Loading />
    </div>
  </div>
</template>

<script>
import FriendApplyMessage from '@/components/chat/messaege/FriendApplyMessage'
import Empty from '@/components/global/Empty.vue'
import Loading from '@/components/global/Loading.vue'
export default {
  components: { FriendApplyMessage, Empty, Loading },
  data() {
    return {}
  },
  methods: {},
  created() {},
}
</script>
<style lang="less" scoped>
.messaege {
  // height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.test {
  width: 600px;
  height: 600px;
  background: rebeccapurple;
}
</style>
