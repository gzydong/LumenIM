<script lang="ts" setup>
import { ref } from 'vue'
import { NModal } from 'naive-ui'

const emit = defineEmits([])

const show = ref(true)

const localStream = ref()
const remoteStream = ref()
const peerConnection = ref()
const remoteVideo = ref()
const localVideo = ref()

const startCall = async () => {
  // 获取本地媒体流
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  localStream.value = stream

  // 将本地视频流绑定到video元素
  // @ts-ignore
  localVideo.value.srcObject = localStream.value

  // 初始化RTCPeerConnection
  peerConnection.value = new RTCPeerConnection()

  // 将本地媒体流添加到RTCPeerConnection
  localStream.value
    .getTracks()
    .forEach((track) => peerConnection.value.addTrack(track, localStream.value))

  // 监听来自远端的IceCandidate
  peerConnection.value.onicecandidate = ({ candidate }) => {
    if (candidate) {
      // 发送candidate到远端
    }
  }

  // 监听远端的media流
  peerConnection.value.ontrack = ({ streams: [stream] }) => {
    remoteStream.value = stream
    // 将远端视频流绑定到video元素
    remoteVideo.value.srcObject = remoteStream.value
  }

  // 创建offer
  const offer = await peerConnection.value.createOffer()
  await peerConnection.value.setLocalDescription(offer)

  // // 发送offer到远端
  // // 远端接收offer，创建answer，并返回给你
  // const answer = /* 远端返回的answer */;

  // // 设置远端的answer
  // await peerConnection.value.setRemoteDescription(answer);
}
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="语音通话"
    class="modal-radius"
    style="max-width: 350px; height: 550px"
    :segmented="{
      content: true,
      footer: true
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="el-container is-vertical launch-box">
      <button @click="startCall">发起视频通话</button>
      <button @click="startCall">挂断</button>

      <!-- 本地视频 -->
      <video autoplay ref="localVideo" id="localVideo" muted playsinline class="local"></video>
      <!-- 远端视频 -->
      <video autoplay ref="remoteVideo" id="remoteVideo" playsinline class="remote"></video>
    </section>

    <template #footer>
      <div class="footer">
        <div></div>

        <div>
          <n-button type="primary" text-color="#ffffff" class="mt-l15"> 确定 </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.launch-box {
  height: 410px;
  width: 100%;
  overflow: hidden;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
