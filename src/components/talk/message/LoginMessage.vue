<script lang="ts" setup>
import { ITalkRecordExtraLogin, ITalkRecord } from '@/types/chat'
import { getExploreName, getExploreOs } from '@/utils/common'

defineProps<{
  extra: ITalkRecordExtraLogin
  data: ITalkRecord
  maxWidth?: Boolean
  talkMode?: Number
}>()
</script>
<template>
  <section class="immsg-login">
    <h3>登录操作通知</h3>
    <p>登录时间：{{ extra.datetime }} (CST)</p>
    <p>IP&nbsp;&nbsp;&nbsp;&nbsp;地址：{{ extra.ip }}</p>
    <p>登录地点：{{ extra.address }}</p>
    <p>
      登录设备：{{ getExploreName(extra.agent) }} /
      {{ getExploreOs(extra.agent) }}
    </p>
    <p>异常原因：{{ extra.reason }}</p>
  </section>
</template>
<style lang="less" scoped>
.immsg-login {
  width: 300px;
  min-height: 50px;
  background: var(--im-message-bg-color);
  border-radius: 5px;
  padding: 15px;
  color: var(--im-text-color);

  p {
    font-size: 13px;
    margin: 10px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
