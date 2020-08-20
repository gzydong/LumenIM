<template>
  <div class="base-mask animated fadeIn" v-if="show">
    <div class="container" v-outside="closeBox">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>录音助手</span>
          <i class="close-btn el-icon-close" @click="closeBox"></i>
        </el-header>

        <el-main class="padding0 mian">
          <h1>{{tipMsg}}</h1>
          <button @click="onStartVoice">开始</button>
          <button @click="onEndVoice">结束</button>
          <button @click="onPlayAudio">播放</button>
          <div class="record-play"
               v-show="isFinished">
            <h2>Current voice player is:</h2>
            <audio id="audioVoice"
                   controls
                   autoplay></audio>
          </div>
        </el-main>

        <el-footer class="footer" height="50px">
          <el-button type="primary" size="medium"  class="btn">立即发送</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    sendChatImgServ
  } from "@/api/chat";
  // https://www.jianshu.com/p/ecea87bd8d25
  // https://www.jianshu.com/p/f5637e838af0
  // http://v.bootstrapmb.com/2019/1/9xrf3471/
  import Record from '@/plugins/recorder/record-sdk';
  export default {
    name: 'image-viewer',
    model: {
      prop: 'show',
      event: 'close'
    },
    props: {
      show: Boolean,
      file: File,
    },
    data() {
      return {
        isVoice: false,
        isFinished: false,
        tipMsg: '录音',
        audio: "",
        recorder: new Record()
      };
    },
    methods: {
      closeBox() {
        this.$emit('close', false);
      },

      // 开始录音
      onStartVoice() {
        this.onStopAudio()
        this.isFinished = false;
        this.recorder.startRecord({
          success: res => {
            this.isVoice = true
          },
          error: e => {
            this.isVoice = false
            this.$toast(e)
          }
        });
      },

      // 结束录音
      onEndVoice() {
        this.isFinished = false;
        this.recorder.stopRecord({
          success: res => {
            this.isVoice = false
            //此处可以获取音频源文件(res)，用于上传等操作
            console.log('音频源文件', res)
          },
          error: e => {
            this.isVoice = false
          }
        });
      },

      // 播放录音
      onPlayAudio() {
        this.isVoice = false
        this.isFinished = true;
        this.audio = document.getElementById("audioVoice");
        this.recorder.play(this.audio);
      },

      // 停止播放录音
      onStopAudio() {
        this.recorder.clear(this.audio);
      }
    }
  };

</script>
<style scoped>
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 450px;
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;
  }

  .container .header .close-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .mian {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .container .mian img {
    max-width: 80%;
    max-height: 80%;
    border-radius: 3px;
    cursor: pointer;
  }

  .container .mian div {
    margin-top: 10px;
    text-align: center;
  }

  .container .mian div .filename {
    font-weight: 400;
  }

  .container .mian div .size {
    color: rgb(148, 140, 140);
    font-size: 12px;
  }

  .container .footer {
    height: 50px;
    background: rgba(247, 245, 245, .66);
    text-align: center;
    line-height: 50px;
  }

  .container .footer .btn {
    width: 150px;
    border-radius: 2px;
  }

</style>
