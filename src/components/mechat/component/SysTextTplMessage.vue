<script lang="ts" setup>
import './sys-message.less'
import { onMounted, useId } from 'vue'
import { useInject } from '@/hooks'
const { toShowUserInfo } = useInject()
const id: string = useId() ?? ''

defineProps<{
  content: string
}>()

onMounted(() => {
  const nodes = document.getElementById(id)?.querySelectorAll('a') || []

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].addEventListener('click', (event) => {
      const el = event.target as HTMLElement
      toShowUserInfo(parseInt(el.dataset.uid as string))
    })
  }
})
</script>

<template>
  <div class="immsg-systext" ref="content">
    <div class="sys-text" :id v-html="content"></div>
  </div>
</template>
