<template>
  <div class="loading-content">
    <div class="ant-spin ant-spin-lg ant-spin-spinning">
      <span class="ant-spin-dot ant-spin-dot-spin">
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
      </span>
    </div>
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '数据加载中 ...',
    },
  },
}
</script>
<style lang="less" scoped>
.loading-content {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  p {
    margin-top: 10px;
  }
}
</style>
