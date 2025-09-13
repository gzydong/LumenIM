<script lang="ts" setup>
import { fetchArticleAnnexDelete } from '@/apis/api'
import { fetchArticleAnnexUpload } from '@/apis/customize'
import { fetchApi } from '@/apis/request'
import { useInject } from '@/hooks'
import { NoteFileItem, useNoteStore } from '@/store'
import { getToken } from '@/utils/auth'
import { getFileNameSuffix } from '@/utils/file'
import { fileFormatSize } from '@/utils/string'
import { UploadOne } from '@icon-park/vue-next'

const { message, dialog } = useInject()
const store = useNoteStore()
const loading = ref(false)
const detail = computed(() => store.detail)

const onTriggerUpload = () => {
  const el = document.getElementById('upload-annex')

  el && el.click()
}

const onUpload = async (e: any) => {
  if (e.target.files.length == 0) return

  const file = e.target.files[0]
  if (file.size / (1024 * 1024) > 5) {
    return message.info('笔记附件不能大于5M!')
  }

  const from = new FormData()
  from.append('annex', file)
  from.append('article_id', `${detail.value.article_id}`)

  const [err, data] = await fetchApi(fetchArticleAnnexUpload, from, { loading })
  if (!err) {
    store.detail.annex_list.push(data)
  }
}

const onDelete = (item: NoteFileItem) => {
  dialog.create({
    title: '删除确认？',
    content: `你确定要删除笔记附件【${item.annex_name}】吗？`,
    negativeText: '取消',
    positiveText: '删除',
    positiveButtonProps: {
      textColor: '#ffffff'
    },
    onPositiveClick: async () => {
      const [err] = await fetchApi(fetchArticleAnnexDelete, { annex_id: item.annex_id })
      if (err) return

      store.detail.annex_list = store.detail.annex_list.filter((i) => i.annex_id != item.annex_id)
      return true
    }
  })
}

// 下载笔记附件服务接口
const onDownload = (annex_id) => {
  const api = import.meta.env.VITE_BASE_API
  try {
    const link = document.createElement('a')

    link.href = `${api}/api/v1/article-annex/download?annex_id=${annex_id}&token=${getToken()}`
    link.click()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="annex-modal">
    <div class="title">
      <span>附件列表({{ detail.annex_list.length }})</span>
    </div>

    <div class="annex-box">
      <div class="annex-main me-scrollbar me-scrollbar-thumb">
        <p v-show="detail.annex_list.length == 0" class="empty-text">暂无附件</p>

        <div v-for="file in detail.annex_list" :key="file.annex_id" class="file-item pointer">
          <div class="suffix">{{ getFileNameSuffix(file.annex_name) }}</div>

          <div class="content">
            <div class="filename text-ellipsis">{{ file.annex_name }}</div>
            <div class="filetool">
              <span class="size">
                {{ fileFormatSize(file.annex_size) }}
              </span>
              <span>{{ file.created_at }}</span>
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
        <p class="notice-text">文件大小在100M以内<br />最多可支持上传10个附件</p>
        <n-button
          text-color="#fff"
          type="primary"
          size="medium"
          :loading="loading"
          @click="onTriggerUpload"
        >
          <template #icon>
            <n-icon :component="UploadOne" />
          </template>
          上传附件
          <input type="file" id="upload-annex" @change="onUpload" style="display: none" />
        </n-button>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.annex-modal {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    font-weight: 500;
    font-size: 16px;
  }

  .annex-box {
    width: 350px;

    .annex-main {
      min-height: 50px;
      border-bottom: 1px solid var(--border-color);
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
        margin: 15px 0;
        user-select: none;
        display: flex;

        .suffix {
          flex-shrink: 0;
          width: 50px;
          height: 100%;
          background-color: #ffcc80;
          border-radius: 3px;
          line-height: 50px;
          text-align: center;
          color: white;
        }

        .content {
          width: 100%;
          height: 100%;
          overflow: hidden;

          .filename {
            padding-left: 5px;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.6;
          }

          .filetool {
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
}
</style>
