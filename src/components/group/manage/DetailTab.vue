<script lang="ts" setup>
import AvatarCropper from '@/components/basic/AvatarCropper.vue'
import { ServGroupDetail, ServeGroupUpdate } from '@/api/group.ts'

const emit = defineEmits(['close'])

const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const cropper = ref(false)

const modelDetail = reactive({
  name: '',
  avatar: '',
  profile: ''
})

const onUploadAvatar = (avatar: string) => {
  cropper.value = false
  modelDetail.avatar = avatar

  onSubmitBaseInfo()
}

const onLoadData = async () => {
  const { code, data } = await ServGroupDetail({ group_id: props.groupId })
  if (code != 200) return

  modelDetail.name = data.group_name
  modelDetail.avatar = data.avatar
  modelDetail.profile = data.profile
}

async function onSubmitBaseInfo() {
  if (modelDetail.name.trim() == '') {
    return window['$message'].info('群名称不能为空')
  }

  await ServeGroupUpdate(
    {
      group_id: props.groupId,
      group_name: modelDetail.name,
      avatar: modelDetail.avatar,
      profile: modelDetail.profile
    },
    {
      successText: '群信息更新成功'
    }
  )
}

onMounted(() => {
  onLoadData()
})
</script>
<template>
  <section class="section el-container is-vertical h-full">
    <header class="el-header header border-bottom">
      <p>基础信息</p>
    </header>

    <main class="el-main main">
      <n-form
        ref="formRef"
        :style="{
          minWinth: '350px',
          maxWidth: '350px'
        }"
      >
        <n-form-item label="群头像:" path="name">
          <n-avatar v-if="modelDetail.avatar" :size="60" :src="modelDetail.avatar" />
          <n-avatar
            v-else
            :size="60"
            :style="{
              color: 'white',
              backgroundColor: '#508afe',
              fontSize: '18px'
            }"
            >{{ modelDetail.name.substring(0, 1) }}</n-avatar
          >
          <n-button
            type="primary"
            size="tiny"
            style="margin-left: 20px"
            dashed
            @click="cropper = true"
          >
            上传头像
          </n-button>
        </n-form-item>

        <n-form-item label="群名称:" required path="name">
          <n-input placeholder="必填" type="text" v-model:value="modelDetail.name" />
        </n-form-item>

        <n-form-item label="群简介:" path="profile">
          <n-input placeholder="选填" type="textarea" v-model:value="modelDetail.profile" />
        </n-form-item>
        <n-form-item label="">
          <n-button type="primary" text-color="#ffffff" @click="onSubmitBaseInfo">
            保存信息
          </n-button>
        </n-form-item>
      </n-form>
    </main>
  </section>

  <!-- 头像裁剪组件 -->
  <AvatarCropper v-if="cropper" @close="cropper = false" @success="onUploadAvatar" />
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.main {
  padding: 15px;
}
</style>
