<script setup>
import { NProgress } from 'naive-ui'
import { useUploadsStore } from '@/store'
import { fileFormatSize } from '@/utils/strings'

const uploadsStore = useUploadsStore()

const statusItem = {
  0: '等待上传',
  1: '上传中',
  2: '上传完成',
  3: '网络异常'
}
</script>

<template>
  <div class="section me-scrollbar me-scrollbar-thumb">
    <div class="title bdr-b">
      <span>上传管理 ({{ uploadsStore.successCount }}/{{ uploadsStore.items.length }})</span>
      <span class="pointer" @click="uploadsStore.close()">关闭</span>
    </div>

    <div class="file-item" v-for="item in uploadsStore.items" :key="item.upload_id">
      <div class="file-header">
        <div class="type-icon flex-center">
          {{ item.username.substr(0, 1) }}
        </div>
        <div class="filename">{{ item.username }}</div>
        <div class="status">
          <span :class="{ success: item.status == 2 }">
            {{ statusItem[item.status] }}
          </span>
        </div>
      </div>

      <div class="file-mian">
        <div class="progress flex-center">
          <n-progress
            style="width: 60px; height: 60px"
            type="circle"
            :percentage="item.percentage"
          />
        </div>
        <div class="detail">
          <p>
            名称：<span>{{ item.file.name }}</span>
          </p>
          <p>
            类型：<span>{{ item.file.type || 'text' }}</span>
          </p>
          <p>
            大小：<span>{{ fileFormatSize(item.file.size) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.section {
  height: 100%;
  width: 100%;

  .title {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .file-item {
    width: 95%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    margin: 15px auto;
    overflow: hidden;
    border: 1px solid var(--im-message-border-color);
    border-radius: 5px;

    .file-header {
      height: 45px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      border-bottom: 1px solid var(--im-message-border-color);

      .type-icon {
        height: 30px;
        width: 30px;
        background-color: rgb(80, 138, 254);
        border-radius: 50%;
        margin-left: 5px;
        font-size: 10px;
        font-weight: 200;
        overflow: hidden;
        color: white;
      }

      .filename {
        margin-left: 10px;
        font-size: 14px;
        width: 65%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        position: absolute;
        right: 14px;
        top: 12px;
        font-size: 13px;
        color: #6b6868;
        font-weight: 200;

        .success {
          color: rgb(103, 194, 58);
        }
      }
    }

    .file-mian {
      padding: 8px;
      display: flex;
      flex-direction: row;

      .progress {
        width: 80px;
        height: 80px;
        flex-shrink: 0;
      }

      .detail {
        flex: auto;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        justify-content: center;
        align-items: flex-start;
        font-size: 13px;

        p {
          margin: 3px;
          color: #ada8a8;

          span {
            color: #595a5a;
            font-weight: 500;
          }
        }
      }
    }
  }
}

:deep(.n-progress-text) {
  font-size: 13px !important;
}
</style>
