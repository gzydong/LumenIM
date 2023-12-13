<script lang="ts" setup></script>

<template>
  <section>
    <h3 class="title">绑定设置</h3>

    <div class="view-box">
      <div class="view-list">
        <div class="image">
          <img src="~@/assets/image/github-avatar.jpg" width="50" height="50" />
        </div>
        <div class="content">
          <div class="name">绑定 github</div>
          <div class="desc">当前未绑定github账号</div>
        </div>
        <div class="tools">
          <n-button type="primary" text> 设置 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="image">
          <img src="~@/assets/image/gitee-avatar.jpg" width="50" height="50" />
        </div>
        <div class="content">
          <div class="name">绑定 gitee</div>
          <div class="desc">当前未绑定gitee账号</div>
        </div>
        <div class="tools">
          <n-button type="primary" text> 设置 </n-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';

.view-box {
  .view-list {
    .image {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 60px;

      img {
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
}
</style>
