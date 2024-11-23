<script lang="ts" setup>
import './sys-message.less'

defineProps<{
  content: string
}>()
</script>

<template>
  <div class="immsg-systext">
    <div class="sys-text">
      {{ content }}
    </div>
  </div>
</template>
