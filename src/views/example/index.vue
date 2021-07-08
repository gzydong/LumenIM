<template>
  <div class="test">
    <FriendApplyMessage />
  </div>
</template>

<script>
import FriendApplyMessage from '@/components/chat/messaege/FriendApplyMessage'
export default {
  components: { FriendApplyMessage },
  data() {
    return {}
  },
  methods: {},
  created() {},
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
