<script lang="ts" setup>
import { fileFormatSize } from '@/utils/string'
import { download, getFileNameSuffix } from '@/utils/file'

defineProps<{
  filename: string
  filesize: number
  msgId: string
  talkMode: number
}>()
</script>

<template>
  <section class="immsg-file">
    <div class="main">
      <div class="ext">{{ getFileNameSuffix(filename) }}</div>
      <div class="file-box">
        <p class="info">
          <span class="name">{{ filename }}</span>
          <span class="size">({{ fileFormatSize(filesize) }})</span>
        </p>
        <p class="notice">文件已成功发送, 文件助手永久保存</p>
      </div>
    </div>
    <div class="footer">
      <a @click="download(msgId, talkMode)">下载</a>
      <a>在线预览</a>
    </div>
  </section>
</template>

<style lang="less" scoped>
.immsg-file {
  width: 250px;
  min-height: 85px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--im-message-border-color);

  .main {
    height: 45px;
    display: flex;
    flex-direction: row;
    margin-top: 5px;

    .ext {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      color: #ffffff;
      background: #49a4ff;
      border-radius: 5px;
      font-size: 12px;
    }

    .file-box {
      flex: 1 1;
      height: 45px;
      margin-left: 10px;
      overflow: hidden;

      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        height: 24px;
        font-size: 14px;

        .name {
          flex: 1 auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .size {
          font-size: 12px;
          color: #cac6c6;
          flex-shrink: 0;
        }
      }

      .notice {
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        color: #929191;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .footer {
    height: 30px;
    line-height: 37px;
    text-align: right;
    font-size: 12px;
    border-top: 1px solid var(--border-color);
    margin-top: 10px;

    a {
      margin: 0 3px;
      user-select: none;
      cursor: pointer;
      color: var(--im-text-color);

      &:hover {
        color: royalblue;
      }
    }
  }
}

html[theme-mode='dark'] {
  .immsg-file {
    border: unset;
    background: rgb(43 43 43);
  }
}
</style>
