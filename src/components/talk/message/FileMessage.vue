<script lang="ts" setup>
import { fileFormatSize } from '@/utils/strings'
import { download, getFileNameSuffix } from '@/utils/functions'
import { ITalkRecordExtraFile, ITalkRecord } from '@/types/chat'

defineProps<{
  extra: ITalkRecordExtraFile
  data: ITalkRecord
  maxWidth?: Boolean
}>()
</script>

<template>
  <section class="file-message">
    <div class="main">
      <div class="ext">{{ getFileNameSuffix(extra.name) }}</div>
      <div class="file-box">
        <p class="info">
          <span class="name">{{ extra.name }}</span>
          <span class="size">({{ fileFormatSize(extra.size) }})</span>
        </p>
        <p class="notice">文件已成功发送, 文件助手永久保存</p>
      </div>
    </div>
    <div class="footer">
      <a @click="download(data.msg_id)">下载</a>
      <a>在线预览</a>
    </div>
  </section>
</template>

<style lang="less" scoped>
.file-message {
  width: 250px;
  min-height: 85px;
  padding: 10px;
  border-radius: 10px;
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
</style>
