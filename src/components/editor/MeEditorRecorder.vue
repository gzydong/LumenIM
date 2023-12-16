<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { NModal } from 'naive-ui'
import { Voice } from '@icon-park/vue-next'
import Recorder from 'js-audio-recorder'
import { countDownTime } from '@/utils/functions'

const emit = defineEmits(['close', 'on-submit'])

const isShow = ref(true)
const status = ref(0) // 0 未开始 1录制中 2已结束
const animation = ref(false)
const duration = ref(0)
let recorder: any = null

const onMaskClick = () => {
  onDestroy()
  emit('close')
}

const onDestroy = () => {
  if (recorder) {
    recorder.destroy()
  }
}

const onSubmit = () => {
  let blob = recorder.getWAVBlob()

  let file = new File([blob], '在线录音.wav', {
    type: blob.type,
    lastModified: Date.now()
  })

  emit('on-submit', file)
  onDestroy()
}

const onStart = () => {
  recorder = new Recorder()

  recorder.start().then(
    () => {
      animation.value = true
      status.value = 1
    },
    (error) => {
      console.log(`${error.name} : ${error.message}`)
    }
  )

  recorder.onprocess = (value) => {
    duration.value = parseInt(value)
  }
}

const onStop = () => {
  recorder.stop()

  animation.value = false
  status.value = 2
}

onUnmounted(() => {
  onDestroy()
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="语音录制"
    class="modal-radius"
    style="max-width: 450px"
    :on-after-leave="onMaskClick"
    :mask-closable="false"
  >
    <main class="main-box">
      <div class="music">
        <span class="line line1" :class="{ 'line-ani': animation }"></span>
        <span class="line line2" :class="{ 'line-ani': animation }"></span>
        <span class="line line3" :class="{ 'line-ani': animation }"></span>
        <span class="line line4" :class="{ 'line-ani': animation }"></span>
        <span class="line line5" :class="{ 'line-ani': animation }"></span>
      </div>

      <div class="tip">
        <p>
          <span v-show="status">{{ status == 1 ? '正在录音' : '已暂停录音' }}</span>
          {{ countDownTime(duration) }}
        </p>
      </div>
    </main>

    <template #footer>
      <div class="footer">
        <n-button v-show="status == 0" type="primary" ghost round @click="onStart">
          <n-icon :component="Voice" />
          &nbsp;开始录音
        </n-button>

        <n-button v-show="status == 1" type="primary" round @click="onStop">
          <n-icon :component="Voice" />
          &nbsp;结束录音
        </n-button>

        <n-button v-show="status == 2" type="primary" ghost round @click="onStart">
          重新录音
        </n-button>

        <n-button v-show="status == 2" type="primary" round @click="onSubmit"> 发送录音 </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 300px;
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .tip {
    margin-top: 35px;
    color: rgb(103, 98, 98);
    font-weight: 300;
  }
}

.footer {
  width: 100%;
  text-align: center;
  :deep(.n-button) {
    margin: 0 3px;
  }
}

.music {
  position: relative;
  width: 180px;
  height: 160px;
  border: 8px solid #eae8e8;
  border-bottom: 0px;
  border-top-left-radius: 110px;
  border-top-right-radius: 110px;
}

.music:before,
.music:after {
  content: '';
  position: absolute;
  bottom: -20px;
  width: 40px;
  height: 82px;
  background-color: #eae8e8;
  border-radius: 15px;
}

.music:before {
  right: -25px;
}

.music:after {
  left: -25px;
}

.line {
  position: absolute;
  width: 6px;
  min-height: 30px;
  transition: 0.5s;

  vertical-align: middle;
  bottom: 0 !important;
  box-shadow: inset 0px 0px 16px -2px rgba(0, 0, 0, 0.15);
}

.line-ani {
  animation: equalize 4s 0s infinite;
  animation-timing-function: linear;
}

.line1 {
  left: 30%;
  bottom: 0px;
  animation-delay: -1.9s;
  background-color: #ff5e50;
}

.line2 {
  left: 40%;
  height: 60px;
  bottom: -15px;
  animation-delay: -2.9s;
  background-color: #a64de6;
}

.line3 {
  left: 50%;
  height: 30px;
  bottom: -1.5px;
  animation-delay: -3.9s;
  background-color: #5968dc;
}

.line4 {
  left: 60%;
  height: 65px;
  bottom: -16px;
  animation-delay: -4.9s;
  background-color: #27c8f8;
}

.line5 {
  left: 70%;
  height: 60px;
  bottom: -12px;
  animation-delay: -5.9s;
  background-color: #cc60b5;
}

@keyframes equalize {
  0% {
    height: 48px;
  }

  4% {
    height: 42px;
  }

  8% {
    height: 40px;
  }

  12% {
    height: 30px;
  }

  16% {
    height: 20px;
  }

  20% {
    height: 30px;
  }

  24% {
    height: 40px;
  }

  28% {
    height: 10px;
  }

  32% {
    height: 40px;
  }

  36% {
    height: 48px;
  }

  40% {
    height: 20px;
  }

  44% {
    height: 40px;
  }

  48% {
    height: 48px;
  }

  52% {
    height: 30px;
  }

  56% {
    height: 10px;
  }

  60% {
    height: 30px;
  }

  64% {
    height: 48px;
  }

  68% {
    height: 30px;
  }

  72% {
    height: 48px;
  }

  76% {
    height: 20px;
  }

  80% {
    height: 48px;
  }

  84% {
    height: 38px;
  }

  88% {
    height: 48px;
  }

  92% {
    height: 20px;
  }

  96% {
    height: 48px;
  }

  100% {
    height: 48px;
  }
}
</style>
