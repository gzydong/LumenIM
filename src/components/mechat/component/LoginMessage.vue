<script lang="ts" setup>
import { getExploreName, getExploreOs } from '@/utils/common'

defineProps<{
  datetime: string
  ip: string
  address: string
  agent: string
  reason: string
}>()
</script>

<template>
  <section class="immsg-login">
    <h4>登录操作通知</h4>
    <p><span>登录时间：</span>{{ datetime }} (CST)</p>
    <p><span>IP&nbsp;&nbsp;&nbsp;&nbsp;地址：</span>{{ ip }}</p>
    <p><span>登录地点：</span>{{ address }}</p>
    <p>
      <span>登录设备：</span>{{ getExploreName(agent) }} /
      {{ getExploreOs(agent) }}
    </p>
    <p><span>异常原因：</span>{{ reason }}</p>
  </section>
</template>

<style lang="less" scoped>
.immsg-login {
  width: inherit;
  max-width: 300px;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid var(--border-color);

  h4 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
  }

  p {
    font-size: 13px;
    margin: 10px 0;

    span {
      font-weight: 400;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

html[theme-mode='dark'] {
  .immsg-login {
    border: unset;
    background: rgb(43 43 43);
  }
}
</style>
