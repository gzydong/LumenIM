<script lang="ts" setup>
import encoder from '@/utils/encoder'

const ws = new WebSocket('ws://127.0.0.1:9508/wss/default.io')
ws.binaryType = 'arraybuffer'

ws.onmessage = function (e) {
  console.log('Received message:', encoder.decode(new Uint8Array(e.data)))
}
</script>

<template></template>

<style scoped lang="less"></style>
