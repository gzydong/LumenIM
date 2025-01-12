<script lang="ts" setup>
import 'md-editor-v3/lib/style.css'
import { ServeGroupDetail, ServeEditGroupNotice } from '@/api/group'
import { toApi } from '@/api'
import { MdPreview, MdEditor } from 'md-editor-v3'
import { Editor, CheckCorrect } from '@icon-park/vue-next'

const isShow = defineModel({ default: false })

const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const isEditorMode = ref(false)
const editorContent = ref('')

const detail = ref({
  updated_at: '',
  content: '',
  modify_user_name: ''
})

async function loadDetail() {
  const { code, data } = await toApi(ServeGroupDetail, { group_id: props.groupId })

  if (code != 200) return

  detail.value = {
    updated_at: data.notice?.updated_at || '',
    content: data.notice?.content || '',
    modify_user_name: data.notice?.modify_user_name || ''
  }

  editorContent.value = data.notice?.content || ''
}

watch(isShow, () => {
  isEditorMode.value = false

  if (isShow.value) loadDetail()
})

const onSave = async () => {
  if (!isEditorMode.value) {
    return (isEditorMode.value = true)
  }

  if (editorContent.value == detail.value.content) {
    return (isEditorMode.value = false)
  }

  const { code } = await toApi(ServeEditGroupNotice, {
    group_id: props.groupId,
    content: editorContent.value
  })

  if (code != 200) return

  isEditorMode.value = false
  detail.value.content = editorContent.value

  loadDetail()
}
</script>

<template>
  <n-drawer
    v-model:show="isShow"
    placement="right"
    show-mask="transparent"
    :width="400"
    :style="{ padding: 0, borderRadius: 0 }"
    to="#drawer-container"
  >
    <n-drawer-content
      :body-content-style="{ padding: 0 }"
      :header-style="{ height: '60px', padding: '0 15px' }"
      closable
    >
      <template #header> 群公告 </template>
      <template #default>
        <template v-if="!detail.content.length">
          <n-empty description="暂无公告" style="margin-top: 100px" />
        </template>

        <template v-else>
          <div style="padding: 0px; height: 100%">
            <MdPreview
              preview-theme="vuepress"
              :show-code-row-number="false"
              v-if="!isEditorMode"
              v-model="detail.content"
            />

            <MdEditor
              v-else
              :preview="false"
              v-model="editorContent"
              :footers="[]"
              :toolbars="[
                'revoke',
                'bold',
                'underline',
                'italic',
                'title',
                'strikeThrough',
                'sub',
                'sup',
                'quote',
                'unorderedList',
                'orderedList',
                'task',
                'code',
                'link',
                'image',
                'table'
              ]"
              style="height: inherit; border: none"
            />

            <n-float-button
              :right="15"
              position="fixed"
              :bottom="50"
              shape="circle"
              type="primary"
              @click="onSave"
            >
              <n-icon size="20" color="#ffffff" :component="isEditorMode ? CheckCorrect : Editor" />
            </n-float-button>
          </div>
        </template>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped></style>
