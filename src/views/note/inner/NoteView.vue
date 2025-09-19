<script lang="ts" setup>
import {
  ApplicationTwo,
  CategoryManagement,
  Comments,
  DownloadFour,
  EditOne,
  FolderUpload,
  Delete as IconDelete,
  Star as IconStar,
  Share,
  TextMessage,
  Time
} from '@icon-park/vue-next'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import AnnexUploadModal from './AnnexUploadModal.vue'
import { useNoteEditor } from './useNoteEditor.ts'

const {
  editor,
  classOptions,
  toolbars,
  isPreviewMode,
  editorBtnText,
  loadStatus,
  themeMode,
  detail,
  onUploadImage,
  onCollection,
  onDownload,
  onDelete,
  onChangeClassify,
  onSaveDebounce,
  onTitle,
  onClickEditorBtn
} = useNoteEditor()
</script>

<template>
  <section v-loading="loadStatus" class="el-container is-vertical note-view">
    <header class="el-header note-view-title app-drag">
      <img v-if="!detail.article_id" src="@/assets/image/md.svg" class="svg-icon" />

      <h4
        :data-aid="detail.article_id"
        :contenteditable="isPreviewMode ? false : 'plaintext-only'"
        @input="onTitle"
      >
        {{ detail.title }}
      </h4>

      <n-icon
        class="pointer"
        v-if="detail.article_id && isPreviewMode"
        @click="onCollection"
        size="16"
        :component="IconStar"
        :color="detail.is_asterisk == 1 ? '#ee3f4d' : ''"
      />

      <n-divider vertical />

      <n-button text size="small" @click="onClickEditorBtn">
        <template #icon>
          <n-icon size="16" :component="EditOne" />
        </template>
        {{ editorBtnText }}
      </n-button>
    </header>

    <header v-if="isPreviewMode" class="el-header note-view-desc text-ellipsis border-top">
      <p>
        <n-icon class="icon" size="15" :component="Time" />
        <span>更新于 {{ detail.updated_at.substring(0, 16) }}分</span>
      </p>

      <p class="pointer">
        <n-icon class="icon" size="15" :component="CategoryManagement" />

        <n-popselect
          v-model:value="detail.classify_id"
          :options="classOptions"
          size="medium"
          :show-arrow="true"
          trigger="click"
          @update:value="onChangeClassify"
          scrollable
        >
          <span>分类 ({{ detail.class_name }})</span>
        </n-popselect>
      </p>

      <p class="pointer">
        <n-icon class="icon" size="15" :component="FolderUpload" />
        <n-popover trigger="click" :show-arrow="true">
          <template #trigger>
            <span>附件 ({{ detail.annex_list.length }})</span>
          </template>
          <AnnexUploadModal />
        </n-popover>
      </p>

      <p>
        <n-icon class="icon" size="15" :component="TextMessage" />
        <span>字数 ({{ editor.markdown.length }})</span>
      </p>
    </header>

    <main class="el-main">
      <MdPreview
        v-if="isPreviewMode"
        preview-theme="vuepress"
        :show-code-row-number="false"
        style="height: 100%; border: none; padding: 15px"
        v-model="editor.markdown"
        :theme="themeMode"
        code-theme="github"
        :codeFoldable="false"
      />

      <MdEditor
        v-else
        v-model="editor.markdown"
        :toolbars="toolbars"
        :show-code-row-number="false"
        :theme="themeMode"
        :preview="false"
        style="height: 100%; border: none"
        @onSave="onSaveDebounce(false)"
        @onUploadImg="onUploadImage"
      />
    </main>
  </section>

  <n-float-button
    v-if="isPreviewMode"
    position="fixed"
    :bottom="100"
    :right="30"
    menu-trigger="hover"
    style="z-index: 1"
  >
    <n-icon size="18" :component="ApplicationTwo" />
    <template #menu>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-float-button>
            <n-icon size="18" :component="Share" />
          </n-float-button>
        </template>
        分享笔记
      </n-tooltip>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-float-button @click="onDownload">
            <n-icon size="18" :component="DownloadFour" />
          </n-float-button>
        </template>
        下载笔记
      </n-tooltip>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-float-button @click="onDelete">
            <n-icon size="18" :component="IconDelete" />
          </n-float-button>
        </template>
        删除笔记
      </n-tooltip>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-float-button>
            <n-icon size="18" :component="Comments" />
          </n-float-button>
        </template>
        评论
      </n-tooltip>
    </template>
  </n-float-button>
</template>

<style lang="less" scoped>
:deep(.md-editor-toolbar-wrapper) {
  padding: 10px 5px;
}

.note-view {
  width: 100%;
  height: 100%;

  .note-view-title {
    min-height: 60px;
    display: flex;
    align-items: center;
    padding: 15px;
    position: relative;
    gap: 10px;

    .svg-icon {
      position: absolute;
      top: 15px;
      left: 6px;
      width: 30px;
      color: #b2bccd !important;
    }

    h4 {
      font-size: 17px;
      line-height: 30px;
      width: 100%;

      &[contenteditable='plaintext-only'][data-aid='0'] {
        margin-left: 26px;
      }

      &[contenteditable='plaintext-only']:empty::before {
        content: '请输入标题 ...';
        color: #aea6a6;
        font-weight: 300;
        pointer-events: none;
      }
    }
  }

  .note-view-desc {
    height: 30px;
    display: flex;
    align-items: center;
    padding: 20px 15px;
    overflow: hidden;
    font-size: 14px;
    position: relative;
    user-select: none;
    color: var(--im-text-color-grey);

    p {
      display: inline;

      span {
        margin-left: 3px;
      }

      margin-right: 10px;
    }
  }
}

html[theme-mode='dark'] {
  .note-view {
    --note-desc-bg-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
