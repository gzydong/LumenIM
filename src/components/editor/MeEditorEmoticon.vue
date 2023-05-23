<script setup>
import { ref, computed } from 'vue'
import { useEditorStore } from '@/store/editor'
import { UploadOne, Delete } from '@icon-park/vue-next'

import { emojiList as emoji } from '@/utils/emojis'

const emit = defineEmits(['on-select'])
const editorStore = useEditorStore()
const fileImageRef = ref()
const tabIndex = ref(0)
const items = computed(() => editorStore.emoticon.items)

// 触发上传按钮事件
const onTriggerUpload = () => {
  fileImageRef.value.click()
}

// 上传表情包
const onUpload = e => {
  let file = e.target.files[0]

  editorStore.uploadUserEmoticon(file)
}

// 删除表情包
const onDelete = (index, id) => {
  editorStore.removeUserEmoticon({ index, id })
}

const onTabs = index => {
  tabIndex.value = index
}

const onSendEmoticon = (type, value) => {
  emit('on-select', { type, value })
}
</script>
<template>
  <form enctype="multipart/form-data" style="display: none">
    <input type="file" ref="fileImageRef" accept="image/*" @change="onUpload" />
  </form>

  <section class="el-container is-vertical section height100">
    <header class="el-header em-header bdr-b">
      <span>{{ items[tabIndex].name }}</span>
      <span class="sys-btn">系统表情</span>
    </header>

    <main class="el-main em-main me-scrollbar">
      <div class="symbol-box" v-if="tabIndex == 0">
        <p class="title">QQ表情</p>
        <div class="options">
          <div
            v-for="(img, key) in emoji.emojis"
            v-html="img"
            @click="onSendEmoticon(1, key)"
            class="option pointer flex-center"
          />
        </div>
        <p class="title">符号表情</p>
        <div class="options">
          <div
            v-for="img in emoji.symbol"
            v-text="img"
            @click="onSendEmoticon(1, img)"
            class="option pointer flex-center"
          />
        </div>
      </div>

      <div class="collect-box" v-else>
        <div
          v-if="tabIndex == 1"
          class="item pointer upload-btn"
          @click="onTriggerUpload"
        >
          <n-icon size="30" class="icon" :component="UploadOne" />
          <span>自定义</span>
        </div>

        <div
          class="item pointer"
          v-for="(item, index) in items[tabIndex].children"
          :key="index"
        >
          <img :src="item.src" @click="onSendEmoticon(2, item.media_id)" />

          <div
            v-if="tabIndex == 1"
            class="mask"
            @click="onDelete(index, item.media_id)"
          >
            <n-icon
              size="18"
              color="#ff5722"
              class="icon"
              :component="Delete"
            />
          </div>
        </div>
      </div>
    </main>

    <footer class="el-footer em-footer tabs">
      <div
        class="tab pointer"
        v-for="(item, index) in items"
        :key="index"
        @click="onTabs(index)"
        :class="{ active: index == tabIndex }"
      >
        <p class="tip">{{ item.name }}</p>
        <img width="20" height="20" :src="item.icon" />
      </div>
    </footer>
  </section>
</template>
<style lang="less" scoped>
.section {
  width: 500px;
  height: 250px;
  overflow: hidden;
  background-color: white;
  border-radius: 3px;

  .em-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    .sys-btn {
      color: #409eff;
      cursor: pointer;
    }
  }

  .em-main {
    height: 100px;
    padding-bottom: 20px;
  }

  .em-footer {
    height: 32px;
    background-color: #f5f5f5;
  }

  .tabs {
    display: flex;
    align-items: center;
    .tab {
      position: relative;
      height: 26px;
      width: 26px;
      background-color: white;
      margin: 2px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background-color: transparent;
      }

      .tip {
        position: absolute;
        left: 0;
        top: -32px;
        height: 26px;
        min-width: 20px;
        white-space: pre;
        padding: 0 5px;
        font-size: 12px;
        border-radius: 2px;
        background-color: rgba(31, 35, 41, 0.9);
        color: white;
        display: none;
        align-items: center;
      }

      &:hover {
        .tip {
          display: flex;
        }

        background-color: #dfdcdc;
      }
    }
  }

  .symbol-box {
    .title {
      width: 50%;
      height: 25px;
      line-height: 25px;
      color: #ccc;
      font-weight: 400;
      padding-left: 3px;
      font-size: 12px;
    }
    .options {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .option {
        height: 32px;
        width: 32px;
        margin: 2px;
        border: 1px dashed #ccc;
        font-size: 24px;
        user-select: none;

        &:hover {
          border-color: #409eff;
        }
      }
    }
  }

  .collect-box {
    display: flex;
    flex-wrap: wrap;

    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      span {
        font-size: 13px;
      }
    }

    .item {
      position: relative;
      width: 65px;
      height: 65px;
      background-color: #eff1f7;
      margin: 2px;

      .mask {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        width: 25px;
        height: 25px;
        background-color: #f5f5f5;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        .mask {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
