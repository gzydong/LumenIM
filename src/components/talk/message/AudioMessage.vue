<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { PlayOne, PauseOne } from '@icon-park/vue-next'
import { ITalkRecordExtraAudio, ITalkRecord } from '@/types/chat'

defineProps<{
  extra: ITalkRecordExtraAudio
  data: ITalkRecord
  maxWidth?: Boolean
}>()

const audioRef = ref()

const durationDesc = ref('-')

const state = reactive({
  isAudioPlay: false,
  progress: 0,
  duration: 0,
  currentTime: 0,
  loading: true
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
  durationDesc.value = formatTime(parseInt(audioRef.value.duration))
  state.loading = false
}

const onError = (e: any) => {
  console.log('音频播放异常===>', e)
}

const onTimeUpdate = () => {
  let audio = audioRef.value
  if (audio.duration == 0) {
    state.progress = 0
  } else {
    state.currentTime = audio.currentTime
    state.progress = (audio.currentTime / audio.duration) * 100
  }
}

const formatTime = (value: number = 0) => {
  if (value == 0) {
    return '-'
  }

  const minutes = Math.floor(value / 60)
  let seconds = value
  if (minutes > 0) {
    seconds = Math.floor(value - minutes * 60)
  }

  return `${minutes}'${seconds}"`
}
</script>
<template>
  <div class="im-message-audio">
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

    <div class="play">
      <div class="btn pointer" @click.stop="onPlay">
        <n-icon :size="18" :component="state.isAudioPlay ? PauseOne : PlayOne" />
      </div>
    </div>
    <div class="desc">
      <span class="line" v-for="i in 23" :key="i"></span>
      <span
        class="indicator"
        :style="{ left: state.progress + '%' }"
        v-show="state.progress > 0"
      ></span>
    </div>
    <div class="time">{{ durationDesc }}</div>
  </div>
</template>
<style lang="less" scoped>
.im-message-audio {
  --audio-bg-color: #f5f5f5;
  --audio-btn-bg-color: #ffffff;

  width: 200px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--audio-bg-color);

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play {
    width: 45px;
    height: inherit;
    flex-shrink: 0;

    .btn {
      width: 26px;
      height: 26px;
      background-color: var(--audio-btn-bg-color);
      border-radius: 50%;
      color: rgb(24, 24, 24);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .desc {
    flex: 1 1;
    height: inherit;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    .line {
      justify-content: space-between;
      height: 30px;
      width: 2px;
      background-color: rgb(40, 39, 39);
      margin-left: 3px;

      &:first-child {
        margin-left: 0;
      }

      &:nth-child(1) {
        height: 16px;
      }
      &:nth-child(2) {
        height: 10px;
      }
      &:nth-child(3) {
        height: 8px;
      }
      &:nth-child(4) {
        height: 6px;
      }
      &:nth-child(5) {
        height: 2px;
      }
      &:nth-child(6) {
        height: 10px;
      }
      &:nth-child(7) {
        height: 20px;
      }

      &:nth-child(8) {
        height: 16px;
      }
      &:nth-child(9) {
        height: 10px;
      }
      &:nth-child(10) {
        height: 13px;
      }
      &:nth-child(11) {
        height: 10px;
      }
      &:nth-child(12) {
        height: 8px;
      }
      &:nth-child(13) {
        height: 15px;
      }
      &:nth-child(14) {
        height: 16px;
      }
      &:nth-child(15) {
        height: 16px;
      }
      &:nth-child(16) {
        height: 15px;
      }
      &:nth-child(17) {
        height: 14px;
      }
      &:nth-child(18) {
        height: 12px;
      }
      &:nth-child(19) {
        height: 8px;
      }
      &:nth-child(20) {
        height: 3px;
      }
      &:nth-child(21) {
        height: 6px;
      }
      &:nth-child(22) {
        height: 10px;
      }
      &:nth-child(23) {
        height: 16px;
      }
    }

    .indicator {
      position: absolute;
      height: 70%;
      width: 1px;
      background-color: #9b9595;
    }
  }

  .time {
    width: 50px;
    height: inherit;
    font-size: 12px;
    flex-shrink: 0;
  }
}

html[theme-mode='dark'] {
  .im-message-audio {
    --audio-bg-color: #2c2c32;
    --audio-btn-bg-color: rgb(78, 75, 75);

    .btn {
      color: #ffffff;
    }

    .desc {
      .line {
        background-color: rgb(169, 167, 167);
      }
    }
  }
}
</style>
