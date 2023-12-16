<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useEditorStore } from '@/store'
import { UploadOne, Delete } from '@icon-park/vue-next'
import { emojis } from '@/utils/emojis'

const emit = defineEmits(['on-select'])
const editorStore = useEditorStore()
const fileImageRef = ref()
const tabIndex = ref(0)
const items = computed<any[]>(() => editorStore.emoticon.items)

// 触发上传按钮事件
const onTriggerUpload = () => {
  fileImageRef.value.click()
}

// 上传表情包
const onUpload = (e: any) => {
  let file = e.target.files[0]

  editorStore.uploadUserEmoticon(file)
}

// 删除表情包
const onDelete = (index: number, id: number) => {
  editorStore.removeUserEmoticon({ index, id })
}

const onTabs = (index: number) => {
  tabIndex.value = index
}

const onSendEmoticon = (type: any, value: any, img = '') => {
  if (img) {
    const imgSrcReg = /<img.*?src='(.*?)'/g
    let match = imgSrcReg.exec(img)
    if (match) {
      emit('on-select', { type, value, img: match[1] })
    }
  } else {
    emit('on-select', { type, value, img })
  }
}
</script>
<template>
  <form enctype="multipart/form-data" style="display: none">
    <input type="file" ref="fileImageRef" accept="image/*" @change="onUpload" />
  </form>

  <section class="el-container is-vertical section height100">
    <header class="el-header em-header bdr-b">
      <span>{{ items[tabIndex].name }}</span>
    </header>

    <main class="el-main em-main me-scrollbar me-scrollbar-thumb">
      <div class="symbol-box" v-if="tabIndex == 0">
        <div class="options">
          <div
            v-for="(img, key) in emojis"
            v-html="img"
            :key="key"
            @click="onSendEmoticon(1, key, img)"
            class="option pointer flex-center"
          />
        </div>
      </div>

      <div class="collect-box" v-else>
        <div v-if="tabIndex == 1" class="item pointer upload-btn" @click="onTriggerUpload">
          <n-icon size="28" class="icon" :component="UploadOne" />
          <span>自定义</span>
        </div>

        <div class="item pointer" v-for="(item, index) in items[tabIndex].children" :key="index">
          <img :src="item.src" @click="onSendEmoticon(2, item.media_id)" />

          <div v-if="tabIndex == 1" class="mask" @click="onDelete(index, item.media_id)">
            <n-icon size="18" color="#ff5722" class="icon" :component="Delete" />
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
  background-color: var(--im-bg-color);
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
  }

  .tabs {
    display: flex;
    align-items: center;
    .tab {
      position: relative;
      height: 26px;
      width: 26px;
      margin: 2px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      &.active {
        background-color: var(--im-active-bg-color);
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
        background-color: var(--im-active-bg-color);
        display: none;
        align-items: center;
        color: var(--im-text-color);
      }

      &:hover {
        .tip {
          display: flex;
        }

        background-color: var(--im-active-bg-color);
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
      padding-left: 8px;
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
        font-size: 24px;
        user-select: none;
        transition: all 0.5s;

        &:hover {
          transform: scale(1.5);
        }
      }
    }
  }

  .collect-box {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;

    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #858585;
      span {
        font-size: 13px;
      }
    }

    .item {
      position: relative;
      width: 70px;
      height: 70px;
      background-color: #eff1f7;
      margin: 5px;
      border-radius: 5px;
      overflow: hidden;

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
        border-radius: 3px;
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

html[theme-mode='dark'] {
  .collect-box .item {
    background-color: #2c2c32;
  }
}
</style>
