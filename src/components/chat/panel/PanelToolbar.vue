<template>
  <div class="multi-select">
    <div class="multi-title">
      <span>已选中：{{ value }} 条消息</span>
    </div>
    <div class="multi-main">
      <div class="btn-group">
        <div
          class="multi-icon pointer"
          @click="$emit('event', 'merge_forward')"
        >
          <i class="el-icon-position" />
        </div>
        <p>合并转发</p>
      </div>
      <div class="btn-group">
        <div class="multi-icon pointer" @click="$emit('event', 'forward')">
          <i class="el-icon-position" />
        </div>
        <p>逐条转发</p>
      </div>
      <div class="btn-group">
        <div class="multi-icon pointer" @click="$emit('event', 'delete')">
          <i class="el-icon-delete" />
        </div>
        <p>批量删除</p>
      </div>
      <div class="btn-group">
        <div class="multi-icon pointer" @click="$emit('event', 'close')">
          <i class="el-icon-close" />
        </div>
        <p>关闭</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 0,
    },
  },
}
</script>
<style lang="less" scoped>
.multi-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .multi-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #878484;
    font-weight: 300;
    font-size: 14px;
  }

  .multi-main {
    .btn-group {
      display: inline-block;
      width: 70px;
      height: 70px;
      margin-right: 15px;

      .multi-icon {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        border-radius: 50%;
        margin: 0 auto;
        border: 1px solid transparent;

        &:hover {
          color: red;
          border-color: red;
          background: transparent;
          font-size: 18px;
        }
      }

      p {
        font-size: 12px;
        margin-top: 8px;
        text-align: center;
      }
    }
  }
}
</style>
