<script lang="ts" setup>
import 'md-editor-v3/lib/style.css'
import { MdEditor, MdPreview, type ToolbarNames, type Themes } from 'md-editor-v3'

import { computed, watch, reactive, ref } from 'vue'
import { NPopover } from 'naive-ui'
import {
  Share,
  Delete as IconDelete,
  DownloadFour,
  FolderFocus,
  Star as IconStar,
  EditOne,
  CategoryManagement,
  Time,
  TextMessage,
  FolderUpload
} from '@icon-park/vue-next'
import AnnexUploadModal from './AnnexUploadModal.vue'
import { debounce } from '@/utils/common'
import { downloadBlobFile } from '@/utils/file'
import { useInject } from '@/hooks'
import { ServeSetAsteriskArticle, ServeEditArticle, ServeDeleteArticle } from '@/api/article'
import { ServeUploadImage } from '@/api/upload'
import { toApi } from '@/api'

import { useNoteStore, useSettingsStore } from '@/store'
const { message, dialog } = useInject()

const settingsStore = useSettingsStore()
const store = useNoteStore()
const detail = computed(() => store.view.detail)

const toolbars: ToolbarNames[] = [
  'revoke',
  'next',
  '-',
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '=',
  'fullscreen',
  'preview',
  'previewOnly',
  'catalog'
]

const editor = reactive({
  title: detail.value.title,
  markdown: detail.value.md_content
})

watch(
  () => store.view.detail.article_id,
  () => {
    editor.markdown = store.view.detail.md_content
    editor.title = store.view.detail.title
  }
)

// 加载状态
const loadStatus = computed(() => store.view.loadStatus)

const loading = ref(false)

const editorMode = computed(() => (store.view.editorMode == 'preview' ? false : 'plaintext-only'))

// 上传笔记图片
const onUploadImage = async (files: File[], callback: any) => {
  if (!files.length) return

  const form = new FormData()
  form.append('file', files[0])

  const { code, data } = await toApi(ServeUploadImage, form)
  if (code != 200) return

  callback([data.src])
}

// 保存笔记
const onSave = async (isCloseEditMode: boolean = false) => {
  if (editor.markdown == '' && detail.value.article_id == 0) {
    return store.close()
  }

  const params = {
    article_id: detail.value.article_id,
    classify_id: detail.value.classify_id,
    title: editor.title,
    md_content: editor.markdown
  }

  const { code, data } = await toApi(ServeEditArticle, params, { loading })
  if (code != 200) return

  if (detail.value.article_id == 0) {
    store.loadClass()
    store.loadNoteList({}, false)
  } else {
    store.updateNoteItem(data.article_id, {
      article_id: data.article_id,
      abstract: data.abstract,
      image: data.image,
      title: data.title
    })
  }

  store.view.detail.md_content = editor.markdown
  store.view.detail.title = editor.title
  store.view.detail.article_id = data.article_id

  if (isCloseEditMode) {
    store.setEditorMode('preview')
  }

  message.success('已保存')
}

// 防抖的保存事件
const onSaveDebounce = debounce(onSave, 500)

// 标题输入键盘事件
const onTitle = (e: any) => {
  if (e.keyCode == 13) {
    return e.preventDefault()
  }

  editor.title = e.target.innerText

  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
    e.preventDefault()
    onSaveDebounce(false)
  }
}

// 收藏笔记
const onCollection = async () => {
  let action = detail.value.is_asterisk == 1 ? 2 : 1

  const { code } = await toApi(ServeSetAsteriskArticle, {
    article_id: detail.value.article_id,
    action: action
  })

  if (code != 200) return

  store.setCollectionStatus(action == 1)
}

// 下载笔记
const onDownload = () => {
  downloadBlobFile(store.view.detail.title + '.md', store.view.detail.md_content)
}

const onDelete = () => {
  dialog.create({
    showIcon: false,
    title: `删除笔记？`,
    content: '笔记删除后30天之内，可在回收站中进行恢复。',
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {
      textColor: '#ffffff'
    },
    onPositiveClick: async () => {
      await toApi(
        ServeDeleteArticle,
        {
          article_id: detail.value.article_id
        },
        {
          onSuccess: () => {
            store.loadNoteList({}, false)
            store.close()
          }
        }
      )
    }
  })
}

const onShare = () => {
  message.info('开发中...')
}
</script>

<template>
  <section class="el-container section" v-loading="loadStatus == 0">
    <main class="el-main">
      <section class="el-container is-vertical height100">
        <header class="el-header editor-title">
          <img src="@/assets/image/md.svg" class="svg-icon" />
          <h4 :contenteditable="editorMode" v-text="editor.title" @keydown="onTitle" />
        </header>

        <header
          v-if="store.view.editorMode == 'preview'"
          class="el-header description text-ellipsis"
        >
          <p>
            <n-icon class="icon" size="14" :component="CategoryManagement" />
            <span class="categorize">{{ store.view.detail.class_name || '默认分类' }}</span>
          </p>
          <p>
            <n-icon class="icon" size="14" :component="Time" />
            <span>最后更新于 {{ store.view.detail.updated_at.substring(0, 16) }} 分</span>
          </p>
          <p>
            <n-icon class="icon" size="14" :component="TextMessage" />
            <span>字数 ({{ editor.markdown.length }})</span>
          </p>

          <p>
            <n-icon class="icon" size="14" :component="FolderUpload" />
            <span>附件 ({{ store.view.detail.annex_list.length }})</span>
          </p>
        </header>

        <main class="el-main">
          <MdPreview
            v-if="store.view.editorMode == 'preview'"
            preview-theme="vuepress"
            :show-code-row-number="false"
            style="height: 100%"
            v-model="editor.markdown"
            :theme="settingsStore.currentThemeMode as Themes"
          />

          <MdEditor
            v-else
            v-model="editor.markdown"
            :preview="false"
            :show-code-row-number="false"
            :theme="settingsStore.currentThemeMode as Themes"
            style="height: 100%; border: unset"
            @onSave="onSaveDebounce(false)"
            :toolbars="toolbars"
            @onUploadImg="onUploadImage"
          />
        </main>
      </section>
    </main>

    <aside class="el-aside navs hidden">
      <div
        v-show="store.view.editorMode == 'preview'"
        class="nav-item"
        @click="store.setEditorMode('edit')"
      >
        <n-icon class="icon" size="18" :component="EditOne" />
        <p>编辑</p>
      </div>

      <div v-show="store.view.editorMode == 'edit'" class="nav-item" @click="onSave(true)">
        <n-icon class="icon" size="18" :component="EditOne" />
        <p v-if="detail.article_id == 0 && editor.markdown.length === 0">取消</p>
        <p v-else>{{ loading ? '保存中..' : '保存' }}</p>
      </div>

      <div
        v-show="detail.article_id"
        class="nav-item"
        :class="{ active: detail.is_asterisk == 1 }"
        @click="onCollection"
      >
        <n-icon class="icon" size="18" :component="IconStar" />
        <p>收藏</p>
      </div>

      <n-popover placement="left" trigger="click" :show-arrow="false" :raw="true">
        <template #trigger>
          <div
            v-show="detail.article_id"
            class="nav-item"
            :class="{ active: store.view.detail.annex_list.length }"
          >
            <n-icon class="icon" size="18" :component="FolderFocus" />
            <p>附件</p>
          </div>
        </template>
        <AnnexUploadModal />
      </n-popover>

      <div v-show="detail.article_id" class="nav-item" @click="onDownload">
        <n-icon class="icon" size="18" :component="DownloadFour" />
        <p>下载</p>
      </div>

      <div v-show="detail.article_id" class="nav-item" @click="onDelete">
        <n-icon class="icon" size="18" :component="IconDelete" />
        <p>删除</p>
      </div>

      <div v-show="detail.article_id" class="nav-item" @click="onShare">
        <n-icon class="icon" size="18" :component="Share" />
        <p>分享</p>
      </div>
    </aside>
  </section>
</template>

<style lang="less" scoped>
.section {
  width: 100%;
  height: 100%;

  .editor-title {
    min-height: 60px;
    display: flex;
    align-items: center;
    padding: 15px 30px;
    position: relative;

    .svg-icon {
      position: absolute;
      top: 15px;
      left: 6px;
      width: 30px;
      color: #b2bccd !important;
    }

    h4 {
      font-size: 18px;
      line-height: 30px;
      width: 100%;
      margin-left: 10px;
    }
  }

  .description {
    height: 30px;
    display: flex;
    align-items: center;
    padding: 20px 10px;
    overflow: hidden;
    font-size: 14px;
    background-color: #fafafa;
    margin: 0 10px;
    border-radius: 3px;
    position: relative;

    p {
      display: inline;

      span {
        margin-left: 5px;
      }

      margin-right: 15px;
    }
  }

  .navs {
    width: 50px;
    border-left: 1px solid #fff;
    box-shadow: 0 0 6px 0 #f6f5f5;
    padding-top: 3px;
    flex-shrink: 0;
    overflow: hidden;

    .nav-item {
      width: 50px;
      height: 50px;
      margin: 8px auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;

      p {
        font-size: 10px;
        margin-top: 5px;
      }

      &.active {
        color: #ff5722;
      }
    }
  }
}

html[theme-mode='dark'] {
  .section {
    background-color: #000;

    .description {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .navs {
      border-left: unset;
      box-shadow: unset;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
