<script setup>
import { ref, computed, reactive } from 'vue'
import { NProgress } from 'naive-ui'
import { LoadingOne, PlayOne, HeadsetOne, PauseOne } from '@icon-park/vue-next'

defineProps({
  extra: Object,
  data: Object,
})

const audioRef = ref()
const state = reactive({
  isAudioPlay: false,
  progress: 0,
  duration: 0,
  currentTime: 0,
  loading: true,
})

const onPlay = () => {
  if (state.isAudioPlay) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }

  state.isAudioPlay = !state.isAudioPlay
}

const onPlayEnd = () => {
  state.isAudioPlay = false
  state.progress = 0
}

const onCanplay = () => {
  state.duration = audioRef.value.duration
  state.loading = false
}

const onError = () => {}

const onTimeUpdate = () => {
  let audio = audioRef.value
  if (audio.duration == 0) {
    state.progress = 0
  } else {
    state.currentTime = audio.currentTime
    state.progress = (audio.currentTime / audio.duration) * 100
  }
}

const getCurrDuration = computed(() => formatSeconds(state.currentTime))

const getTotalDuration = computed(() => formatSeconds(state.duration))

function formatSeconds(value) {
  var theTime = parseInt(value) // 秒
  var theTime1 = 0 // 分
  var theTime2 = 0 // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }

  var result = '' + parseInt(theTime) //秒
  if (10 > theTime > 0) {
    result = '0' + parseInt(theTime) //秒
  } else {
    result = '' + parseInt(theTime) //秒
  }

  if (10 > theTime1 > 0) {
    result = '0' + parseInt(theTime1) + ':' + result //分，不足两位数，首位补充0，
  } else {
    result = '' + parseInt(theTime1) + ':' + result //分
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + ':' + result //时
  }
  return result
}
</script>
<template>
  <div class="audio-message">
    <audio
      ref="audioRef"
      preload="auto"
      type="audio/mp3,audio/wav"
      :src="extra.url"
      @timeupdate="onTimeUpdate"
      @ended="onPlayEnd"
      @canplay="onCanplay"
      @error="onError"
    />

    <div class="videodisc">
      <div
        v-if="state.loading"
        class="disc"
        :class="{ play: state.isAudioPlay }"
      >
        <n-icon size="24" :component="LoadingOne" />
      </div>

      <div
        v-else
        class="disc"
        :class="{ play: state.isAudioPlay }"
        @click.stop="onPlay"
      >
        <n-icon size="24" v-if="state.isAudioPlay" :component="PauseOne" />
        <n-icon v-else :component="PlayOne" />
      </div>
    </div>
    <div class="detail">
      <div class="text">
        <n-icon :component="HeadsetOne" />
        <span>{{ getCurrDuration }} / {{ getTotalDuration }}</span>
      </div>
      <div class="process">
        <n-progress
          :percentage="parseInt(state.progress)"
          :height="5"
          :show-indicator="false"
        />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.audio-message {
  width: 200px;
  height: 60px;
  border-radius: 5px;
  background: #ffffff;
  display: flex;
  align-items: center;
  border: 1px solid #ff5722;
  overflow: hidden;

  > div {
    height: 100%;
  }

  .videodisc {
    flex-basis: 60px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .disc {
      width: 42px;
      height: 42px;
      background: #ff5722;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;

      &.play {
        background: #ff5722;
        animation: spin 3s linear infinite;
      }

      i {
        font-size: 24px;
      }
    }
  }

  .detail {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;

    .text {
      width: 90%;
      font-size: 12px;
      display: flex;
      align-items: center;
      i {
        margin-right: 5px;
      }
    }

    .process {
      padding-top: 10px;
      height: 20px;
      width: 90%;
    }
  }
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
