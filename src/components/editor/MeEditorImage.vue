<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { NModal } from 'naive-ui'
import { fileFormatSize } from '@/utils/strings'
import { emitCall } from '@/utils/common'

const emit = defineEmits(['close', 'submit'])
const props = defineProps({
  file: {
    type: File,
    default: null
  }
})

const state: any = reactive({
  show: true,
  src: '',
  size: '',
  loading: false
})

const onMaskClick = () => {
  emit('close')
}

const onSendClick = () => {
  state.loading = true

  let call = emitCall(null, null, (value) => {
    state.loading = false
    value && onMaskClick()
  })

  emit('submit', call)
}

function loadFileSrc(file) {
  let reader = new FileReader()

  state.size = file.size

  reader.onload = () => {
    state.src = reader.result
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  loadFileSrc(props.file)
})
</script>

<template>
  <n-modal
    v-model:show="state.show"
    class="custom-card"
    preset="card"
    title="图片预览"
    size="huge"
    :bordered="false"
    style="max-width: 455px; border-radius: 10px"
    :on-after-leave="onMaskClick"
  >
    <div class="preview">
      <img :src="state.src" />
    </div>

    <template #footer>
      <div style="width: 100%; text-align: center">
        <n-button type="primary" @click="onSendClick" :loading="state.loading">
          发送图片({{ fileFormatSize(state.size) }})
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.preview {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
