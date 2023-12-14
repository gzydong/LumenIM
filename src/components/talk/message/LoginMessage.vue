<script lang="ts" setup>
import { ITalkRecordExtraLogin, ITalkRecord } from '@/types/chat'

defineProps<{
  extra: ITalkRecordExtraLogin
  data: ITalkRecord
  maxWidth?: Boolean
}>()

function getExploreName(userAgent = '') {
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    return 'Opera'
  } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
    return 'IE'
  } else if (userAgent.indexOf('Edge') > -1) {
    return 'Edge'
  } else if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox'
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1) {
    return 'Safari'
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
    return 'Chrome'
  } else {
    return 'Unkonwn'
  }
}

function getExploreOs(userAgent = '') {
  if (userAgent.indexOf('Mac OS') > -1) {
    return 'Mac OS'
  } else {
    return 'Windows'
  }
}
</script>
<template>
  <section class="im-message-login">
    <h4>登录操作通知</h4>
    <p>登录时间：{{ extra.datetime }} (CST)</p>
    <p>IP 地址：{{ extra.ip }}</p>
    <p>登录地点：{{ extra.address }}</p>
    <p>
      登录设备：{{ getExploreName(extra.agent) }} /
      {{ getExploreOs(extra.agent) }}
    </p>
    <p>异常原因：{{ extra.reason }}</p>
  </section>
</template>
<style lang="less" scoped>
.im-message-login {
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
