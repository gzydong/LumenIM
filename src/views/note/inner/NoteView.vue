<script lang="ts" setup>
import 'md-editor-v3/lib/style.css'
import { MdEditor, MdPreview } from 'md-editor-v3'
import { NPopover, NPopselect, NFloatButton, NTooltip } from 'naive-ui'
import {
  Share,
  Delete as IconDelete,
  DownloadFour,
  Star as IconStar,
  EditOne,
  CategoryManagement,
  Time,
  TextMessage,
  FolderUpload,
  ApplicationTwo,
  Comments,
  History
} from '@icon-park/vue-next'
import AnnexUploadModal from './AnnexUploadModal.vue'
import { useNoteEditor } from './useNoteEditor.ts'

const {
  editor,
  classOptions,
  toolbars,
  isPreviewMode,
  onUploadImage,
  onCollection,
  onDownload,
  onDelete,
  onChangeClassify,
  onSaveDebounce,
  editorBtnText,
  loadStatus,
  onTitle,
  onClickEditorBtn,
  themeMode,
  detail
} = useNoteEditor()
</script>

<template>
  <section
    class="el-container is-vertical height100 note-view"
    v-loading="loadStatus"
    style="width: 100%; max-width: 1200px; margin: 0 auto"
  >
    <header class="el-header note-view-title app-drag">
      <img v-if="!detail.article_id" src="@/assets/image/md.svg" class="svg-icon" />

      <IconStar
        v-if="detail.article_id && isPreviewMode"
        :theme="detail.is_asterisk == 1 ? 'filled' : 'outline'"
        fill="#ee3f4d"
        :size="22"
        class="pointer"
        @click="onCollection"
      />

      <h4
        :data-aid="detail.article_id"
        :contenteditable="isPreviewMode ? false : 'plaintext-only'"
        v-text="editor.title"
        @keydown="onTitle"
      />

      <n-button size="small" strong secondary @click="onClickEditorBtn">
        <template #icon>
          <n-icon size="16" :component="EditOne" />
        </template>
        {{ editorBtnText }}
      </n-button>

      <n-button size="small" strong secondary style="margin-left: 5px">
        <template #icon>
          <n-icon size="16" :component="History" />
        </template>
      </n-button>
    </header>

    <header v-if="isPreviewMode" class="el-header note-view-desc text-ellipsis">
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
        style="height: 100%; border: unset"
        v-model="editor.markdown"
        :theme="themeMode"
        code-theme="github"
      />

      <MdEditor
        v-else
        v-model="editor.markdown"
        :show-code-row-number="false"
        :preview="false"
        :theme="themeMode"
        style="height: 100%; border: unset"
        @onSave="onSaveDebounce(false)"
        :toolbars="toolbars"
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
.note-view {
  width: 100%;
  height: 100%;

  --note-desc-bg-color: #fafafa;

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
        content: '请输入标题...';
        color: #999;
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
    background-color: var(--note-desc-bg-color);
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
