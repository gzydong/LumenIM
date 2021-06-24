<template>
  <div class="empty-content">
    <div class="image">
      <img :src="src" />
    </div>
    <div class="text" v-text="text" />
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: {
      type: String,
      default: '数据为空...',
    },
    src: {
      type: String,
      default: require('@/assets/image/no-oncall.6b776fcf.png'),
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style lang="less" scoped>
.empty-content {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;

  .image {
    width: 200px;
    height: 200px;

    img {
      width: 100%;
    }
  }
}
</style>
