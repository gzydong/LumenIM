<script lang="ts" setup>
import { ref, computed } from 'vue'
import { formatTime } from '@/utils/datetime'
import { fileFormatSize } from '@/utils/strings'
import {
  ServeUploadArticleAnnex,
  ServeDownloadAnnex as onDownload,
  ServeDeleteArticleAnnex
} from '@/api/article'
import { toApi } from '@/api'
import { useNoteStore, NoteFileItem } from '@/store'
import { UploadOne } from '@icon-park/vue-next'
import { useInject } from '@/hooks'

const { message, dialog } = useInject()
const store = useNoteStore()
const loading = ref(false)
const detail = computed(() => store.view.detail)

const onTriggerUpload = () => {
  const el = document.getElementById('upload-annex')

  el && el.click()
}

const onUpload = async (e: any) => {
  if (e.target.files.length == 0) return

  let file = e.target.files[0]
  if (file.size / (1024 * 1024) > 5) {
    return message.info('笔记附件不能大于5M!')
  }

  loading.value = true

  let from = new FormData()
  from.append('annex', file)
  from.append('article_id', `${detail.value.article_id}`)

  let { code, data } = await toApi(ServeUploadArticleAnnex, from, { loading })
  if (code == 200) {
    store.view.detail.annex_list.push(data)
  }
}

const onDelete = (item: NoteFileItem) => {
  dialog.create({
    title: '删除确认？',
    content: `你确定要删除笔记附件【${item.annex_name}】吗？`,
    negativeText: '取消',
    positiveText: '删除',
    onPositiveClick: async () => {
      let { code } = await toApi(ServeDeleteArticleAnnex, { annex_id: item.annex_id })
      if (code != 200) return

      store.view.detail.annex_list = store.view.detail.annex_list.filter(
        (i) => i.annex_id != item.annex_id
      )
      return true
    }
  })
}
</script>

<template>
  <input type="file" id="upload-annex" @change="onUpload" style="display: none" />

  <section class="section">
    <div class="title">
      <span>附件列表({{ detail.annex_list.length }})</span>
    </div>

    <div class="annex-box">
      <div class="annex-main me-scrollbar me-scrollbar-thumb">
        <p v-show="detail.annex_list.length == 0" class="empty-text">暂无附件</p>

        <div v-for="file in detail.annex_list" :key="file.annex_id" class="file-item pointer">
          <div class="suffix">suffix</div>

          <div class="content">
            <div class="filename">{{ file.annex_name }}</div>
            <div class="filetool">
              <span class="size">
                {{ fileFormatSize(file.annex_size) }}
              </span>
              <span>{{ formatTime(file.created_at) }}</span>
              <div class="tools">
                <n-space>
                  <n-button type="primary" size="tiny" text @click="onDownload(file.annex_id)">
                    下载
                  </n-button>
                  <n-button type="error" size="tiny" text @click="onDelete(file)"> 删除 </n-button>
                </n-space>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="annex-footer">
        <p class="notice-text">文件大小在5M以内<br />最多可支持上传10个附件</p>
        <n-button type="primary" size="medium" :loading="loading" @click="onTriggerUpload">
          <template #icon>
            <n-icon :component="UploadOne" />
          </template>
          上传附件
        </n-button>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.section {
  padding: 15px;
  background: #ffffff;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    font-weight: 500;
    font-size: 15px;
  }
}

.annex-box {
  width: 300px;
  background-color: white;

  .annex-main {
    min-height: 30px;
    border-bottom: 1px solid rgb(239, 233, 233);
    margin-bottom: 8px;
    padding: 5px 0;
    max-height: 400px;
    overflow-y: auto;

    .empty-text {
      color: #969292;
      font-size: 12px;
      margin-top: 10px;
    }

    .file-item {
      height: 50px;
      margin-bottom: 5px;
      margin-top: 10px;
      user-select: none;

      .suffix {
        width: 50px;
        height: 100%;
        background-color: #ffcc80;
        border-radius: 3px;
        float: left;
        line-height: 50px;
        text-align: center;
        color: white;
      }

      .content {
        float: left;
        width: 247px;
        height: 100%;

        .filename {
          padding-left: 5px;
          color: #172b4d;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .filetool {
          color: #505f79;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.6;
          padding-left: 5px;
          margin-top: 9px;
          position: relative;

          span {
            margin: 0 3px;
            &.size {
              color: #3a8ee6;
            }
          }
        }

        .tools {
          position: absolute;
          top: -5px;
          right: 5px;
          width: 60px;
          height: 24px;
          text-align: right;
          line-height: 28px;
        }
      }
    }
  }

  .annex-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    padding: 5px 5px 5px 0;

    .notice-text {
      color: #ccc;
      font-size: 12px;
      user-select: none;
    }
  }
}
</style>
