<template>
  <div class="audio-message">
    <div class="videodisc">
      <div class="disc" :class="{ play: isPlay }" @click="toPlay">
        <i v-if="loading" class="el-icon-loading" />
        <i v-else-if="isPlay" class="el-icon-video-pause" />
        <i v-else class="el-icon-video-play" />
        <audio
          ref="audio"
          type="audio/mp3"
          :src="src"
          @timeupdate="timeupdate"
          @ended="ended"
          @canplay="canplay"
        ></audio>
      </div>
    </div>
    <div class="detail">
      <div class="text">
        <i class="el-icon-service" />
        <span>{{ getCurrDuration }} / {{ getTotalDuration }}</span>
      </div>
      <div class="process">
        <el-progress :percentage="progress" :show-text="false" />
      </div>
    </div>
  </div>
</template>

<script>
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

export default {
  name: 'AudioMessage',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: true,
      isPlay: false,
      duration: 0,
      currentTime: 0,
      progress: 0,
    }
  },
  computed: {
    getTotalDuration() {
      return formatSeconds(this.duration)
    },
    getCurrDuration() {
      return formatSeconds(this.currentTime)
    },
  },
  methods: {
    toPlay() {
      if (this.loading) {
        return
      }

      let audio = this.$refs.audio
      if (this.isPlay) {
        audio.pause()
      } else {
        audio.play()
      }
      this.isPlay = !this.isPlay
    },

    // 当目前的播放位置已更改时
    timeupdate() {
      let audio = this.$refs.audio
      this.currentTime = audio.currentTime
      this.progress = (audio.currentTime / audio.duration) * 100
    },

    // 当浏览器可以播放音频/视频时
    canplay() {
      this.duration = this.$refs.audio.duration
      this.loading = false
    },

    // 当目前的播放列表已结束时
    ended() {
      this.isPlay = false
    },
  },
}
</script>
<style scoped lang="less">
.audio-message {
  width: 200px;
  height: 60px;
  border-radius: 5px;
  background: #ffffff;
  display: flex;
  align-items: center;
  border: 1px solid #03a9f4;
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
      background: #e9e5e5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: ease 0.5;

      &.play {
        background: #ff5722;
        box-shadow: 0 0 4px 0px #f76a3e;
      }

      i {
        font-size: 24px;
      }

      &:active i {
        transform: scale(1.1);
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
</style>
