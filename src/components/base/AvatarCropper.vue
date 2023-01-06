<script setup>
import { reactive, ref } from 'vue'
import { NModal, NCard } from 'naive-ui'
import { CloseSharp, CloudUploadOutline, SyncSharp } from '@vicons/ionicons5'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { ServeUploadAvatar } from '@/api/upload'

const emit = defineEmits(['close', 'success'])
const state = reactive({
  show: true,
  src: '',
})

const cropper = ref('cropper')

const option = reactive({
  img: '',
  size: 1,
  full: false,
  outputType: 'png',
  canMove: false,
  fixedBox: true,
  original: false,
  canMoveBox: true,
  autoCrop: true,
  autoCropWidth: 250,
  autoCropHeight: 250,
  centerBox: false,
  high: true,
  preview: '',
})

const onMaskClick = () => {
  emit('close')
}

function onTriggerUpload() {
  document.getElementById('upload-avatar').click()
}

const onUpload = e => {
  let file = e.target.files[0]

  console.log(file)

  let reader = new FileReader()
  reader.onload = e => {
    let data
    if (typeof e.target.result === 'object') {
      // 把Array Buffer转化为blob 如果是base64不需要
      data = window.URL.createObjectURL(new Blob([e.target.result]))
    } else {
      data = e.target.result
    }

    option.img = data
  }

  reader.readAsArrayBuffer(file)
}

const realTime = data => {
  cropper.value.getCropData(img => {
    option.preview = img
  })
}

const rotateLeft = () => {
  cropper.value.rotateLeft()
}
const rotateRight = () => {
  cropper.value.rotateRight()
}

const refreshCrop = () => {
  cropper.value.refresh()
}

const onSubmit = () => {
  cropper.value.getCropBlob(blob => {
    let file = new File([blob], 'avatar.png', {
      type: blob.type,
      lastModified: Date.now(),
    })

    const form = new FormData()
    form.append('file', file)

    ServeUploadAvatar(form).then(res => {
      if (res.code == 200) {
        emit('success', res.data.avatar)
      } else {
        $message.info(res.message)
      }
    })
  })
}
</script>

<template>
  <input
    id="upload-avatar"
    type="file"
    accept="image/png, image/jpeg, image/jpg"
    @change="onUpload"
  />
  <n-modal v-model:show="state.show" :on-after-leave="onMaskClick">
    <n-card
      style="width: 800px; border-radius: 10px"
      title="选择头像"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-icon
          size="22"
          :component="CloseSharp"
          @click="state.show = false"
          style="cursor: pointer"
        />
      </template>

      <div class="content">
        <div class="canvas">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            @real-time="realTime"
          />
        </div>
        <div class="view">
          <div class="preview">
            <img :src="option.preview" v-show="option.preview" />
          </div>
        </div>
      </div>

      <template #footer>
        <section class="el-container" style="height: 38px">
          <aside
            class="el-aside"
            style="
              width: 400px;
              justify-content: space-between;
              align-items: center;
              display: flex;
              padding: 0 5px;
            "
          >
            <n-button @click="onTriggerUpload" type="info" ghost>
              上传图片
              <template #icon>
                <n-icon :component="CloudUploadOutline" />
              </template>
            </n-button>

            <n-button @click="refreshCrop">
              刷新
              <template #icon>
                <n-icon :component="SyncSharp" />
              </template>
            </n-button>

            <n-button @click="rotateLeft">
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M511.4 124C290.5 124.3 112 303 112 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-.3 13 6.3 12.9l167-.8c5.2 0 9-4.9 7.7-9.9L369.8 727a8 8 0 0 0-14.1-3L315 776.1c-10.2-8-20-16.7-29.3-26a318.64 318.64 0 0 1-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7c29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6c29.4 29.4 52.5 63.6 68.6 101.7c16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 0 1-68.6 101.7c-7.5 7.5-15.3 14.5-23.4 21.2a7.93 7.93 0 0 0-1.2 11.1l39.4 50.5c2.8 3.5 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-221.1-179.4-400.2-400.6-399.9z"
                    fill="currentColor"
                  ></path>
                </svg>
              </template>
              左转
            </n-button>

            <n-button @click="rotateRight">
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92C290 92 102.3 279.5 102 511.5C101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1c1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 0 0-10.1 4.8c-1.8 5-3.8 10-5.9 14.9c-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 0 1 655.9 829c-42.3 17.9-87.4 27-133.8 27c-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 0 1 279 755.2a342.16 342.16 0 0 1-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4c31.6-31.6 68.4-56.4 109.3-73.8c42.3-17.9 87.4-27 133.8-27c46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 0 1 109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </template>
              右转
            </n-button>
          </aside>
          <main class="el-main" style="text-align: center">
            <n-button type="info" @click="onSubmit">保存图片</n-button>
          </main>
        </section>
      </template>
    </n-card>
  </n-modal>
</template>

<style lang="less" scoped>
#upload-avatar {
  display: none;
}
.content {
  width: 100%;
  height: 400px;
  display: flex;

  .canvas {
    width: 400px;
    height: 400px;
    padding: 5px;
  }

  .view {
    flex: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview {
      width: 180px;
      height: 180px;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #f1eaea;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
