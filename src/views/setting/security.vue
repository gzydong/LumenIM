<script lang="ts" setup>
import { ref } from 'vue'
import EditPassword from '@/components/user/EditorPassword.vue'
import EditMobile from '@/components/user/EditorMobile.vue'
import EditEmail from '@/components/user/EditorEmail.vue'
import { useUserStore } from '@/store'
import { hidePhone } from '@/utils/strings'

const userStore = useUserStore()
const isShowChangePassword = ref(false)
const isShowChangeMobile = ref(false)
const isShowChangeEmail = ref(false)

const onChangeMobileSuccess = (value: string) => {
  isShowChangeMobile.value = false
  userStore.mobile = value
}

const onChangeEmailSuccess = (value: string) => {
  isShowChangeEmail.value = false
  userStore.email = value
}
</script>

<template>
  <section>
    <h3 class="title">安全设置</h3>

    <div class="view-box">
      <div class="view-list">
        <div class="content">
          <div class="name">账户密码</div>
          <div class="desc">当前密码强度 ：中</div>
        </div>
        <div class="tools">
          <n-button type="primary" text @click="isShowChangePassword = true"> 修改 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">绑定手机</div>
          <div class="desc">已绑定手机 ：{{ hidePhone(userStore.mobile) }}</div>
        </div>
        <div class="tools">
          <n-button type="primary" text @click="isShowChangeMobile = true"> 修改 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">绑定邮箱</div>
          <div class="desc">已绑定邮箱 ：{{ userStore.email || '未设置' }}</div>
        </div>
        <div class="tools">
          <n-button type="primary" text @click="isShowChangeEmail = true"> 修改 </n-button>
        </div>
      </div>
    </div>
  </section>

  <EditPassword v-model="isShowChangePassword" />
  <EditMobile v-model="isShowChangeMobile" @success="onChangeMobileSuccess" />
  <EditEmail v-model="isShowChangeEmail" @success="onChangeEmailSuccess" />
</template>
<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
