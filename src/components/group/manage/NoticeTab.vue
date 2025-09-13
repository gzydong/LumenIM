<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import { fetchGroupDetail, fetchGroupNoticeEdit } from '@/apis/api'
import { fetchUploadImage } from '@/apis/customize'
import { fetchApi, sync } from '@/apis/request'
import { onMounted, ref } from 'vue'

const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const editorContent = ref('')
const onSave = async () => {
  await fetchApi(
    fetchGroupNoticeEdit,
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

  sync(async () => {
    const data = await fetchUploadImage(form)
    callback([data.src])
  })
}

const loadDetail = async () => {
  const [err, data] = await fetchApi(fetchGroupDetail, { group_id: props.groupId })

  if (err) return

  editorContent.value = data.notice?.content || ''
}

onMounted(() => {
  loadDetail()
})
</script>
<template>
  <section class="section el-container is-vertical h-full">
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
