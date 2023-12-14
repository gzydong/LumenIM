<script lang="ts" setup>
import 'xgplayer/dist/index.min.css'
import { ref, nextTick } from 'vue'
import { NImage, NModal, NCard } from 'naive-ui'
import { Play, Close } from '@icon-park/vue-next'
import { getImageInfo } from '@/utils/functions'
import Player from 'xgplayer'
import { ITalkRecordExtraVideo, ITalkRecord } from '@/types/chat'

const props = defineProps<{
  extra: ITalkRecordExtraVideo
  data: ITalkRecord
  maxWidth?: Boolean
}>()

const img = (src: string, width = 200) => {
  const info: any = getImageInfo(src)

  if (info.width == 0 || info.height == 0) {
    return {}
  }

  if (info.height > 300) {
    return {
      height: '300px'
    }
  }

  if (info.width < width) {
    return {
      width: `${info.width}px`,
      height: `${info.height}px`
    }
  }

  return {
    width: width + 'px',
    height: info.height / (info.width / width) + 'px'
  }
}

const open = ref(false)

async function onPlay() {
  open.value = true

  await nextTick()

  new Player({
    id: 'im-xgplayer',
    url: props.extra.url,
    fluid: true,
    autoplay: true,
    lang: 'zh-cn'
  })
}
</script>
<template>
  <section
    class="im-message-video"
    :class="{ left: data.float === 'left' }"
    :style="img(extra.cover, 350)"
    @click="onPlay"
  >
    <n-image :src="extra.cover" preview-disabled />

    <div class="btn-video">
      <n-icon :component="Play" size="36" />
    </div>

    <n-modal v-model:show="open">
      <n-card
        style="width: 800px; min-height: 300px; background-color: #ffffff; position: relative"
        role="dialog"
        aria-modal="true"
      >
        <div id="im-xgplayer"></div>
        <div class="im-xgplayer-close" @click="open = false">
          <n-icon :component="Close" size="18" />
        </div>
      </n-card>
    </n-modal>
  </section>
</template>
<style lang="less" scoped>
.im-message-video {
  overflow: hidden;
  padding: 5px;
  border-radius: 5px;
  background: var(--im-message-left-bg-color);
  min-width: 30px;
  min-height: 30px;
  display: inline-flex;
  position: relative;

  &.left {
    background: var(--im-message-right-bg-color);
  }

  :deep(.n-image img) {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .btn-video {
    width: 30px;
    height: 20px;
    position: absolute;
    left: calc(50% - 15px);
    top: calc(50% - 10px);
    cursor: pointer;
    color: #ffffff;
  }

  &:hover {
    .btn-video {
      color: #03a9f4;
    }
  }
}

.im-xgplayer-close {
  position: absolute;
  height: 35px;
  width: 35px;
  background-color: #f5f5f5;
  right: -45px;
  top: -45px;
  cursor: pointer;
  border-radius: 50%;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
