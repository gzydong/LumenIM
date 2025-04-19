<script lang="ts" setup>
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3'

import { ref, onMounted } from 'vue'
import { ServGroupDetail, ServGroupNoticeUpdate } from '@/api/group'
import { ServUploadImage } from '@/api/upload'

const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const editorContent = ref('')
const onSave = async () => {
  await ServGroupNoticeUpdate(
    {
      group_id: props.groupId,
      content: editorContent.value
    },
    {
      successText: '已保存'
    }
  )
}

const onUploadImage = async (files: File[], callback: any) => {
  if (!files.length) return

  const form = new FormData()
  form.append('file', files[0])

  const { code, data } = await ServUploadImage(form)
  if (code != 200) return

  callback([data.src])
}

const loadDetail = async () => {
  const { code, data } = await ServGroupDetail({ group_id: props.groupId })

  if (code != 200) return

  editorContent.value = data.notice?.content || ''
}

onMounted(() => {
  loadDetail()
})
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header border-bottom">
      <p>群公告</p>
    </header>

    <main class="el-main">
      <MdEditor
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
          'code',
          'link',
          'image',
          'table',
          '=',
          'previewOnly',
          'save'
        ]"
        @save="onSave"
        @onUploadImg="onUploadImage"
        style="border: none; height: 100%"
      />
    </main>
  </section>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
</style>
