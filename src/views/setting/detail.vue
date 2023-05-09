<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NSelect, NDatePicker } from 'naive-ui'
import { ServeUpdateUserDetail, ServeGetUserDetail } from '@/api/user'
import { GenderOptions } from '@/constant/default'
import AvatarCropper from '@/components/base/AvatarCropper.vue'
import { hidePhone } from '@/utils/strings'

const router = useRouter()
const cropper = ref(false)

const detail = reactive({
  avatar: '',
  nickname: '',
  mobile: '',
  email: '',
  gender: '0',
  motto: '0',
  birthday: ref(null),
  loading: false,
})

// 加载用户信息
ServeGetUserDetail().then(res => {
  detail.nickname = res.data.nickname.toString()
  detail.mobile = res.data.mobile.toString()
  detail.email = res.data.email.toString()
  detail.gender = res.data.gender.toString()
  detail.motto = res.data.motto.toString()
  detail.avatar = res.data.avatar
  if (res.data.birthday) {
    detail.birthday = ref(res.data.birthday)
  }
})

// 修改用户信息
const onChangeDetail = () => {
  if (!detail.nickname.trim()) {
    return window.$message.warning('昵称不能为空！')
  }

  detail.loading = true

  const response = ServeUpdateUserDetail({
    nickname: detail.nickname.trim(),
    avatar: detail.avatar,
    motto: detail.motto,
    gender: parseInt(detail.gender),
    birthday: detail.birthday,
  })

  response.then(() => {
    window.$message.success('信息保存成功！')
  })

  response.catch(() => {
    window.$message.warning('信息保存失败！')
  })

  response.finally(() => {
    detail.loading = false
  })
}

const onUploadAvatar = avatar => {
  cropper.value = false
  detail.avatar = avatar
}
</script>

<template>
  <h3 class="title">个人信息</h3>

  <section class="el-container">
    <aside class="el-aside el-aside-left">
      <n-avatar
        :size="200"
        :src="detail.avatar"
        @click="cropper = true"
        class="avatar-box pointer"
      />

      <n-button text @click="cropper = true"> 点击修改头像 </n-button>
    </aside>

    <main class="el-main" style="padding-right: 20px">
      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
        style="max-width: 500px; margin-top: 25px"
      >
        <n-form-item label="登录账号：">
          {{ hidePhone(detail.mobile) }}
          <n-button
            class="mt-l15"
            type="info"
            text
            @click="router.push('/settings/security')"
          >
            修改
          </n-button>
        </n-form-item>
        <n-form-item label="电子邮箱：">
          {{ detail.email }}
          <n-button
            class="mt-l15"
            type="info"
            text
            @click="router.push('/settings/security')"
          >
            修改
          </n-button>
        </n-form-item>
        <n-form-item label="我的昵称：">
          <n-input
            placeholder="我的昵称"
            v-model:value="detail.nickname"
            maxlength="20"
            show-count
          />
        </n-form-item>
        <n-form-item label="我的性别：">
          <n-select
            v-model:value="detail.gender"
            placeholder="设置你的性别"
            :options="GenderOptions"
            style="max-width: 192px"
          />
        </n-form-item>
        <n-form-item label="我的生日：">
          <n-date-picker
            v-model:formatted-value="detail.birthday"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </n-form-item>
        <n-form-item label="个性签名：">
          <n-input
            placeholder="关于我的"
            type="textarea"
            maxlength="500"
            show-count
            v-model:value="detail.motto"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            @click="onChangeDetail"
            :loading="detail.loading"
            style="margin-left: 94px"
          >
            保存信息
          </n-button>
        </n-form-item>
      </n-form>
    </main>
  </section>

  <!-- 头像裁剪组件 -->
  <AvatarCropper
    v-if="cropper"
    @close="cropper = false"
    @success="onUploadAvatar"
  />
</template>

<style lang="less" scoped>
@import '@/assets/css/settting.less';

.el-aside-left {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-right: 25px;
  border-right: 1px solid #f7f5f5;
}

.avatar-box {
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>