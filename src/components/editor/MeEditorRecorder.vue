<template>
  <div class="lum-dialog-mask animated fadeIn">
    <el-container class="lum-dialog-box">
      <el-header class="no-padding header no-select" height="50px">
        <p>语音消息</p>
        <p class="tools"><i class="el-icon-close" @click="closeBox" /></p>
      </el-header>

      <el-main class="no-padding mian">
        <div class="music">
          <span class="line line1" :class="{ 'line-ani': animation }"></span>
          <span class="line line2" :class="{ 'line-ani': animation }"></span>
          <span class="line line3" :class="{ 'line-ani': animation }"></span>
          <span class="line line4" :class="{ 'line-ani': animation }"></span>
          <span class="line line5" :class="{ 'line-ani': animation }"></span>
        </div>
        <div style="margin-top: 35px; color: #676262; font-weight: 300">
          <template v-if="recorderStatus == 0">
            <p style="font-size: 13px; margin-top: 5px">
              <span>语音消息，让聊天更简单方便 ...</span>
            </p>
          </template>
          <template
            v-else-if="
              recorderStatus == 1 || recorderStatus == 2 || recorderStatus == 3
            "
          >
            <p>{{ datetime }}</p>
            <p style="font-size: 13px; margin-top: 5px">
              <span v-if="recorderStatus == 1">正在录音...</span>
              <span v-else-if="recorderStatus == 2">已暂停录音</span>
              <span v-else-if="recorderStatus == 3">录音时长</span>
            </p>
          </template>
          <template
            v-else-if="
              recorderStatus == 4 || recorderStatus == 5 || recorderStatus == 6
            "
          >
            <p>{{ formatPlayTime }}</p>
            <p style="font-size: 13px; margin-top: 5px">
              <span v-if="recorderStatus == 4">正在播放</span>
              <span v-else-if="recorderStatus == 5">已暂停播放</span>
              <span v-else-if="recorderStatus == 6">播放已结束</span>
            </p>
          </template>
        </div>
      </el-main>

      <el-footer class="footer" height="50px">
        <!-- 0:未开始录音 1:正在录音 2:暂停录音 3:结束录音 4:播放录音 5:停止播放 -->
        <el-button
          v-show="recorderStatus == 0"
          type="primary"
          size="mini"
          round
          icon="el-icon-microphone"
          @click="startRecorder"
          >开始录音
        </el-button>
        <el-button
          v-show="recorderStatus == 1"
          type="primary"
          size="mini"
          round
          icon="el-icon-video-pause"
          @click="pauseRecorder"
          >暂停录音
        </el-button>
        <el-button
          v-show="recorderStatus == 2"
          type="primary"
          size="mini"
          round
          icon="el-icon-microphone"
          @click="resumeRecorder"
          >继续录音
        </el-button>
        <el-button
          v-show="recorderStatus == 2"
          type="primary"
          size="mini"
          round
          icon="el-icon-microphone"
          @click="stopRecorder"
          >结束录音
        </el-button>
        <el-button
          v-show="recorderStatus == 3 || recorderStatus == 6"
          type="primary"
          size="mini"
          round
          icon="el-icon-video-play"
          @click="playRecorder"
          >播放录音
        </el-button>

        <el-button
          v-show="
            recorderStatus == 3 || recorderStatus == 5 || recorderStatus == 6
          "
          type="primary"
          size="mini"
          round
          icon="el-icon-video-play"
          @click="startRecorder"
          >重新录音
        </el-button>

        <el-button
          v-show="recorderStatus == 4"
          type="primary"
          size="mini"
          round
          icon="el-icon-video-pause"
          @click="pausePlayRecorder"
          >暂停播放
        </el-button>
        <el-button
          v-show="recorderStatus == 5"
          type="primary"
          size="mini"
          round
          icon="el-icon-video-play"
          @click="resumePlayRecorder"
          >继续播放
        </el-button>

        <el-button
          v-show="
            recorderStatus == 3 || recorderStatus == 5 || recorderStatus == 6
          "
          type="primary"
          size="mini"
          round
          @click="submit"
          >立即发送
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import Recorder from 'js-audio-recorder'

export default {
  name: 'MeEditorRecorder',
  data() {
    return {
      // 录音实例
      recorder: null,

      // 录音时长
      duration: 0,

      // 播放时长
      playTime: 0,

      animation: false,

      // 当前状态
      recorderStatus: 0, //0:未开始录音 1:正在录音 2:暂停录音 3:结束录音 4:播放录音 5:停止播放 6:播放结束

      playTimeout: null,
    }
  },
  computed: {
    datetime() {
      let hour = parseInt((this.duration / 60 / 60) % 24) //小时
      let minute = parseInt((this.duration / 60) % 60) //分钟
      let seconds = parseInt(this.duration % 60) //秒

      if (hour < 10) hour = `0${hour}`
      if (minute < 10) minute = `0${minute}`
      if (seconds < 10) seconds = `0${seconds}`

      return `${hour}:${minute}:${seconds}`
    },
    formatPlayTime() {
      let hour = parseInt((this.playTime / 60 / 60) % 24) //小时
      let minute = parseInt((this.playTime / 60) % 60) //分钟
      let seconds = parseInt(this.playTime % 60) //秒

      if (hour < 10) hour = `0${hour}`
      if (minute < 10) minute = `0${minute}`
      if (seconds < 10) seconds = `0${seconds}`

      return `${hour}:${minute}:${seconds}`
    },
  },
  destroyed() {
    if (this.recorder) {
      this.destroyRecorder()
    }
  },
  methods: {
    closeBox() {
      if (this.recorder == null) {
        this.$emit('close', false)
        return
      }

      if (this.recorderStatus == 1) {
        this.stopRecorder()
      } else if (this.recorderStatus == 4) {
        this.pausePlayRecorder()
      }

      // 销毁录音后关闭窗口
      this.destroyRecorder(() => {
        this.$emit('close', false)
      })
    },

    // 开始录音
    startRecorder() {
      let _this = this
      // http://recorder.api.zhuyuntao.cn/Recorder/event.html
      // https://blog.csdn.net/qq_41619796/article/details/107865602
      this.recorder = new Recorder()
      this.recorder.onprocess = duration => {
        duration = parseInt(duration)
        _this.duration = duration
      }

      this.recorder.start().then(
        () => {
          this.recorderStatus = 1
          this.animation = true
        },
        error => {
          console.log(`${error.name} : ${error.message}`)
        }
      )
    },
    // 暂停录音
    pauseRecorder() {
      this.recorder.pause()
      this.recorderStatus = 2
      this.animation = false
    },
    // 继续录音
    resumeRecorder() {
      this.recorderStatus = 1
      this.recorder.resume()
      this.animation = true
    },
    // 结束录音
    stopRecorder() {
      this.recorderStatus = 3
      this.recorder.stop()
      this.animation = false
    },
    // 录音播放
    playRecorder() {
      this.recorderStatus = 4
      this.recorder.play()
      this.playTimeouts()
      this.animation = true
    },
    // 暂停录音播放
    pausePlayRecorder() {
      this.recorderStatus = 5
      this.recorder.pausePlay()
      clearInterval(this.playTimeout)
      this.animation = false
    },
    // 恢复录音播放
    resumePlayRecorder() {
      this.recorderStatus = 4
      this.recorder.resumePlay()
      this.playTimeouts()
      this.animation = true
    },
    // 销毁录音
    destroyRecorder(callBack) {
      this.recorder.destroy().then(() => {
        this.recorder = null
        if (callBack) {
          callBack()
        }
      })
    },
    // 获取录音文件大小（单位：字节）
    recorderSize() {
      return this.recorder.fileSize
    },

    playTimeouts() {
      this.playTimeout = setInterval(() => {
        let time = parseInt(this.recorder.getPlayTime())
        this.playTime = time
        if (time == this.duration) {
          clearInterval(this.playTimeout)
          this.animation = false
          this.recorderStatus = 6
        }
      }, 100)
    },

    submit() {
      let blob = this.recorder.getWAVBlob()
      //blob转file
      let file = new File([blob], "在线录音.wav", {
        type: blob.type,
        lastModified: Date.now(),
      })

      this.$emit('send', file)
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 500px;
  max-width: 500px;
  height: 450px;

  .mian {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .footer {
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-top: 1px solid #f7f3f3;
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
