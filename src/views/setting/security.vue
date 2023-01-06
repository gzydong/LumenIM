<script setup>
import { ref } from 'vue'
import EditPassword from '@/components/user/EditorPassword.vue'
import EditMobile from '@/components/user/EditorMobile.vue'
import EditEmail from '@/components/user/EditorEmail.vue'
import { useUserStore } from '@/store/user'
import { hidePhone } from '@/utils/strings'

const userStore = useUserStore()
const isShowChangePassword = ref(false)
const isShowChangeMobile = ref(false)
const isShowChangeEmail = ref(false)
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
          <n-button
            quaternary
            round
            type="info"
            text
            @click="isShowChangePassword = true"
          >
            修改
          </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">绑定手机</div>
          <div class="desc">已绑定手机 ：{{ hidePhone(userStore.mobile) }}</div>
        </div>
        <div class="tools">
          <n-button quaternary round type="info" text> 修改 </n-button>
        </div>
      </div>

      <div class="view-list">
        <div class="content">
          <div class="name">绑定邮箱</div>
          <div class="desc">已绑定邮箱 ：{{ userStore.email }}</div>
        </div>
        <div class="tools">
          <n-button quaternary round type="info" text> 修改 </n-button>
        </div>
      </div>
    </div>
  </section>

  <EditPassword
    v-if="isShowChangePassword"
    @close="isShowChangePassword = false"
  />
  <EditMobile v-if="isShowChangeMobile" @close="isShowChangeMobile = false" />
  <EditEmail v-if="isShowChangeEmail" @close="isShowChangeEmail = false" />
</template>
<style lang="less" scoped>
@import '@/assets/css/settting.less';
</style>
